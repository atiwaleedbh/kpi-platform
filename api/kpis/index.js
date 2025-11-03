const { supabase } = require('../../lib/supabase');
const { success, error, created } = require('../../lib/response');
const { corsMiddleware } = require('../../lib/cors');

module.exports = async (req, res) => {
  await corsMiddleware(req, res);

  try {
    if (req.method === 'GET') {
      return await getAllKPIs(req, res);
    } else if (req.method === 'POST') {
      return await createKPI(req, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('KPI API Error:', err);
    return error(res, err.message);
  }
};

async function getAllKPIs(req, res) {
  const { status, category } = req.query;

  let query = supabase
    .from('kpis')
    .select(`
      *,
      category:categories(*)
    `)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  if (category) {
    query = query.eq('category_id', category);
  }

  const { data, error: dbError } = await query;

  if (dbError) throw dbError;

  // Calculate performance for each KPI
  const kpisWithPerformance = data.map(kpi => ({
    ...kpi,
    performance: kpi.target_value && kpi.current_value
      ? ((kpi.current_value / kpi.target_value) * 100).toFixed(2)
      : null
  }));

  return success(res, kpisWithPerformance, kpisWithPerformance.length);
}

async function createKPI(req, res) {
  const {
    name,
    description,
    category,
    unit,
    customUnit,
    targetValue,
    targetType,
    frequency,
    status,
    tags
  } = req.body;

  if (!name || !category || !unit) {
    return error(res, 'Missing required fields: name, category, unit', 400);
  }

  const { data, error: dbError } = await supabase
    .from('kpis')
    .insert({
      name,
      description,
      category_id: category,
      unit,
      custom_unit: customUnit,
      target_value: targetValue,
      target_type: targetType || 'maximize',
      frequency: frequency || 'daily',
      status: status || 'active',
      tags: tags || []
    })
    .select(`
      *,
      category:categories(*)
    `)
    .single();

  if (dbError) throw dbError;

  return created(res, data);
}
