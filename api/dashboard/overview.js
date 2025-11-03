const { supabase } = require('../../lib/supabase');
const { success, error } = require('../../lib/response');
const { corsMiddleware } = require('../../lib/cors');

module.exports = async (req, res) => {
  await corsMiddleware(req, res);

  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get counts
    const { count: totalKPIs } = await supabase
      .from('kpis')
      .select('*', { count: 'exact', head: true });

    const { count: activeKPIs } = await supabase
      .from('kpis')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: totalCategories } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    const { count: totalMetrics } = await supabase
      .from('metrics')
      .select('*', { count: 'exact', head: true });

    // Get recent metrics (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recentMetrics } = await supabase
      .from('metrics')
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', sevenDaysAgo.toISOString());

    // Get KPIs by status
    const { data: allKPIs } = await supabase
      .from('kpis')
      .select('status');

    const kpisByStatus = allKPIs.reduce((acc, kpi) => {
      const existing = acc.find(item => item._id === kpi.status);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ _id: kpi.status, count: 1 });
      }
      return acc;
    }, []);

    // Get KPIs by category
    const { data: kpisWithCategory } = await supabase
      .from('kpis')
      .select(`
        category_id,
        category:categories(name)
      `);

    const kpisByCategory = kpisWithCategory.reduce((acc, kpi) => {
      if (kpi.category) {
        const existing = acc.find(item => item._id === kpi.category_id);
        if (existing) {
          existing.count++;
        } else {
          acc.push({
            _id: kpi.category_id,
            name: kpi.category.name,
            count: 1
          });
        }
      }
      return acc;
    }, []);

    // Get top performing KPIs
    const { data: topKPIs } = await supabase
      .from('kpis')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('status', 'active')
      .order('current_value', { ascending: false })
      .limit(5);

    // Get KPIs needing attention
    const { data: allActiveKPIs } = await supabase
      .from('kpis')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('status', 'active')
      .not('target_value', 'is', null);

    const needsAttention = allActiveKPIs
      .filter(kpi => {
        const performance = (kpi.current_value / kpi.target_value) * 100;
        return performance < 70;
      })
      .slice(0, 5);

    return success(res, {
      overview: {
        totalKPIs: totalKPIs || 0,
        activeKPIs: activeKPIs || 0,
        totalCategories: totalCategories || 0,
        totalMetrics: totalMetrics || 0,
        recentMetrics: recentMetrics || 0
      },
      kpisByStatus,
      kpisByCategory,
      topKPIs,
      needsAttention
    });
  } catch (err) {
    console.error('Dashboard Overview API Error:', err);
    return error(res, err.message);
  }
};
