const { supabase } = require('../../lib/supabase');
const { success, error } = require('../../lib/response');
const { corsMiddleware } = require('../../lib/cors');

module.exports = async (req, res) => {
  await corsMiddleware(req, res);

  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { data: kpis, error: dbError } = await supabase
      .from('kpis')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('status', 'active');

    if (dbError) throw dbError;

    const summary = kpis.map(kpi => {
      let performanceStatus = 'on-track';
      let performancePercent = 0;

      if (kpi.target_value) {
        performancePercent = (kpi.current_value / kpi.target_value) * 100;

        if (kpi.target_type === 'maximize') {
          if (performancePercent >= 100) performanceStatus = 'excellent';
          else if (performancePercent >= 80) performanceStatus = 'on-track';
          else if (performancePercent >= 60) performanceStatus = 'at-risk';
          else performanceStatus = 'critical';
        } else if (kpi.target_type === 'minimize') {
          if (performancePercent <= 100) performanceStatus = 'excellent';
          else if (performancePercent <= 120) performanceStatus = 'on-track';
          else if (performancePercent <= 150) performanceStatus = 'at-risk';
          else performanceStatus = 'critical';
        }
      }

      return {
        kpi: {
          id: kpi.id,
          name: kpi.name,
          category: kpi.category,
          unit: kpi.unit
        },
        currentValue: kpi.current_value,
        targetValue: kpi.target_value,
        trend: kpi.trend,
        performancePercent: performancePercent.toFixed(2),
        performanceStatus
      };
    });

    return success(res, summary);
  } catch (err) {
    console.error('Dashboard Performance API Error:', err);
    return error(res, err.message);
  }
};
