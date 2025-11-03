const { supabase } = require('../../lib/supabase');
const { success, error, notFound } = require('../../lib/response');
const { corsMiddleware } = require('../../lib/cors');

module.exports = async (req, res) => {
  await corsMiddleware(req, res);

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      return await getMetricById(id, res);
    } else if (req.method === 'PUT') {
      return await updateMetric(id, req.body, res);
    } else if (req.method === 'DELETE') {
      return await deleteMetric(id, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Metric API Error:', err);
    return error(res, err.message);
  }
};

async function getMetricById(id, res) {
  const { data, error: dbError } = await supabase
    .from('metrics')
    .select(`
      *,
      kpi:kpis(*)
    `)
    .eq('id', id)
    .single();

  if (dbError) {
    if (dbError.code === 'PGRST116') {
      return notFound(res, 'Metric not found');
    }
    throw dbError;
  }

  return success(res, data);
}

async function updateMetric(id, body, res) {
  const updateData = {};

  if (body.value !== undefined) updateData.value = parseFloat(body.value);
  if (body.period !== undefined) updateData.period = body.period;
  if (body.periodStart !== undefined) updateData.period_start = body.periodStart;
  if (body.periodEnd !== undefined) updateData.period_end = body.periodEnd;
  if (body.notes !== undefined) updateData.notes = body.notes;
  if (body.metadata !== undefined) updateData.metadata = body.metadata;

  const { data, error: dbError } = await supabase
    .from('metrics')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      kpi:kpis(*)
    `)
    .single();

  if (dbError) {
    if (dbError.code === 'PGRST116') {
      return notFound(res, 'Metric not found');
    }
    throw dbError;
  }

  return success(res, data);
}

async function deleteMetric(id, res) {
  const { error: dbError } = await supabase
    .from('metrics')
    .delete()
    .eq('id', id);

  if (dbError) throw dbError;

  return success(res, {});
}
