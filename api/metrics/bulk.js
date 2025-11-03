const { supabase } = require('../../lib/supabase');
const { success, error, created } = require('../../lib/response');
const { corsMiddleware } = require('../../lib/cors');

module.exports = async (req, res) => {
  await corsMiddleware(req, res);

  try {
    if (req.method === 'POST') {
      const { metrics } = req.body;

      if (!Array.isArray(metrics) || metrics.length === 0) {
        return error(res, 'Metrics array is required', 400);
      }

      // Transform metrics to database format
      const metricsToInsert = metrics.map(m => ({
        kpi_id: m.kpi,
        value: parseFloat(m.value),
        period: m.period,
        period_start: m.periodStart,
        period_end: m.periodEnd,
        notes: m.notes,
        metadata: m.metadata,
        created_by: m.createdBy || 'system'
      }));

      const { data, error: dbError } = await supabase
        .from('metrics')
        .insert(metricsToInsert)
        .select();

      if (dbError) throw dbError;

      return created(res, data);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Bulk Metrics API Error:', err);
    return error(res, err.message);
  }
};
