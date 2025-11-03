const { supabase } = require('../../lib/supabase');
const { success, error, created } = require('../../lib/response');
const { corsMiddleware } = require('../../lib/cors');

module.exports = async (req, res) => {
  await corsMiddleware(req, res);

  try {
    if (req.method === 'GET') {
      return await getAllMetrics(req, res);
    } else if (req.method === 'POST') {
      return await createMetric(req, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Metrics API Error:', err);
    return error(res, err.message);
  }
};

async function getAllMetrics(req, res) {
  const { kpi, startDate, endDate, period } = req.query;

  let query = supabase
    .from('metrics')
    .select(`
      *,
      kpi:kpis(*)
    `)
    .order('timestamp', { ascending: false });

  if (kpi) {
    query = query.eq('kpi_id', kpi);
  }

  if (period) {
    query = query.eq('period', period);
  }

  if (startDate) {
    query = query.gte('timestamp', startDate);
  }

  if (endDate) {
    query = query.lte('timestamp', endDate);
  }

  const { data, error: dbError } = await query;

  if (dbError) throw dbError;

  return success(res, data, data.length);
}

async function createMetric(req, res) {
  const { kpi, value, period, periodStart, periodEnd, notes, metadata, createdBy } = req.body;

  if (!kpi || value === undefined || !period || !periodStart || !periodEnd) {
    return error(res, 'Missing required fields', 400);
  }

  // Verify KPI exists
  const { data: kpiData, error: kpiError } = await supabase
    .from('kpis')
    .select('id')
    .eq('id', kpi)
    .single();

  if (kpiError || !kpiData) {
    return error(res, 'KPI not found', 404);
  }

  // Create metric (trigger will update KPI values)
  const { data, error: dbError } = await supabase
    .from('metrics')
    .insert({
      kpi_id: kpi,
      value: parseFloat(value),
      period,
      period_start: periodStart,
      period_end: periodEnd,
      notes,
      metadata,
      created_by: createdBy || 'system'
    })
    .select(`
      *,
      kpi:kpis(*)
    `)
    .single();

  if (dbError) throw dbError;

  return created(res, data);
}
