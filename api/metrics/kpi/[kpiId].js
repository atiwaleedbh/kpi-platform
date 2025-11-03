const { supabase } = require('../../../lib/supabase');
const { success, error } = require('../../../lib/response');
const { corsMiddleware } = require('../../../lib/cors');

module.exports = async (req, res) => {
  await corsMiddleware(req, res);

  const { kpiId } = req.query;
  const { limit = 50, period } = req.query;

  try {
    if (req.method === 'GET') {
      let query = supabase
        .from('metrics')
        .select('*')
        .eq('kpi_id', kpiId)
        .order('timestamp', { ascending: false })
        .limit(parseInt(limit));

      if (period) {
        query = query.eq('period', period);
      }

      const { data, error: dbError } = await query;

      if (dbError) throw dbError;

      return success(res, data, data.length);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Metrics by KPI API Error:', err);
    return error(res, err.message);
  }
};
