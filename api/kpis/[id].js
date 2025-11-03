const { supabase } = require('../../lib/supabase');
const { success, error, notFound } = require('../../lib/response');
const { corsMiddleware } = require('../../lib/cors');

module.exports = async (req, res) => {
  await corsMiddleware(req, res);

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      return await getKPIById(id, res);
    } else if (req.method === 'PUT') {
      return await updateKPI(id, req.body, res);
    } else if (req.method === 'DELETE') {
      return await deleteKPI(id, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('KPI API Error:', err);
    return error(res, err.message);
  }
};

async function getKPIById(id, res) {
  const { data, error: dbError } = await supabase
    .from('kpis')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', id)
    .single();

  if (dbError) {
    if (dbError.code === 'PGRST116') {
      return notFound(res, 'KPI not found');
    }
    throw dbError;
  }

  // Calculate performance
  const kpiWithPerformance = {
    ...data,
    performance: data.target_value && data.current_value
      ? ((data.current_value / data.target_value) * 100).toFixed(2)
      : null
  };

  return success(res, kpiWithPerformance);
}

async function updateKPI(id, body, res) {
  const updateData = {};

  // Map fields
  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.category !== undefined) updateData.category_id = body.category;
  if (body.unit !== undefined) updateData.unit = body.unit;
  if (body.customUnit !== undefined) updateData.custom_unit = body.customUnit;
  if (body.targetValue !== undefined) updateData.target_value = body.targetValue;
  if (body.targetType !== undefined) updateData.target_type = body.targetType;
  if (body.frequency !== undefined) updateData.frequency = body.frequency;
  if (body.status !== undefined) updateData.status = body.status;
  if (body.tags !== undefined) updateData.tags = body.tags;

  const { data, error: dbError } = await supabase
    .from('kpis')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      category:categories(*)
    `)
    .single();

  if (dbError) {
    if (dbError.code === 'PGRST116') {
      return notFound(res, 'KPI not found');
    }
    throw dbError;
  }

  return success(res, data);
}

async function deleteKPI(id, res) {
  // First delete associated metrics (cascade should handle this, but being explicit)
  await supabase.from('metrics').delete().eq('kpi_id', id);

  const { error: dbError } = await supabase
    .from('kpis')
    .delete()
    .eq('id', id);

  if (dbError) throw dbError;

  return success(res, {});
}
