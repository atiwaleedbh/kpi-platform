const { supabase } = require('../../lib/supabase');
const { success, error } = require('../../lib/response');
const { corsMiddleware } = require('../../lib/cors');

module.exports = async (req, res) => {
  await corsMiddleware(req, res);

  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { period = 'daily', days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get metrics for the period
    const { data: metrics, error: dbError } = await supabase
      .from('metrics')
      .select(`
        *,
        kpi:kpis(*)
      `)
      .gte('timestamp', startDate.toISOString())
      .eq('period', period)
      .order('timestamp', { ascending: true });

    if (dbError) throw dbError;

    // Group by KPI
    const trendsByKPI = {};
    metrics.forEach(metric => {
      const kpiId = metric.kpi.id;
      if (!trendsByKPI[kpiId]) {
        trendsByKPI[kpiId] = {
          kpi: metric.kpi,
          data: []
        };
      }
      trendsByKPI[kpiId].data.push({
        timestamp: metric.timestamp,
        value: metric.value
      });
    });

    return success(res, Object.values(trendsByKPI));
  } catch (err) {
    console.error('Dashboard Trends API Error:', err);
    return error(res, err.message);
  }
};
