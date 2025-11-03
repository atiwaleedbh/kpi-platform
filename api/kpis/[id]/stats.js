const { supabase } = require('../../../lib/supabase');
const { success, error, notFound } = require('../../../lib/response');
const { corsMiddleware } = require('../../../lib/cors');

module.exports = async (req, res) => {
  await corsMiddleware(req, res);

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      return await getKPIStats(id, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('KPI Stats API Error:', err);
    return error(res, err.message);
  }
};

async function getKPIStats(id, res) {
  // Get KPI
  const { data: kpi, error: kpiError } = await supabase
    .from('kpis')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', id)
    .single();

  if (kpiError) {
    if (kpiError.code === 'PGRST116') {
      return notFound(res, 'KPI not found');
    }
    throw kpiError;
  }

  // Get latest metrics (last 30)
  const { data: metrics, error: metricsError } = await supabase
    .from('metrics')
    .select('*')
    .eq('kpi_id', id)
    .order('timestamp', { ascending: false })
    .limit(30);

  if (metricsError) throw metricsError;

  // Calculate statistics
  let statistics = {
    average: '0.00',
    minimum: 0,
    maximum: 0,
    dataPoints: 0
  };

  if (metrics.length > 0) {
    const values = metrics.map(m => parseFloat(m.value));
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;

    statistics = {
      average: avg.toFixed(2),
      minimum: Math.min(...values),
      maximum: Math.max(...values),
      dataPoints: metrics.length
    };
  }

  return success(res, {
    kpi,
    statistics,
    recentMetrics: metrics.slice(0, 10)
  });
}
