const { supabase } = require('../../lib/supabase');
const { success, error, created } = require('../../lib/response');
const { corsMiddleware } = require('../../lib/cors');

module.exports = async (req, res) => {
  await corsMiddleware(req, res);

  try {
    if (req.method === 'GET') {
      return await getAllCategories(res);
    } else if (req.method === 'POST') {
      return await createCategory(req.body, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Categories API Error:', err);
    return error(res, err.message);
  }
};

async function getAllCategories(res) {
  const { data: categories, error: dbError } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (dbError) throw dbError;

  // Get KPI count for each category
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const { count, error: countError } = await supabase
        .from('kpis')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id);

      if (countError) throw countError;

      return {
        ...category,
        kpiCount: count || 0
      };
    })
  );

  return success(res, categoriesWithCount, categoriesWithCount.length);
}

async function createCategory(body, res) {
  const { name, description, color, icon } = body;

  if (!name) {
    return error(res, 'Name is required', 400);
  }

  const { data, error: dbError } = await supabase
    .from('categories')
    .insert({
      name,
      description,
      color: color || '#3B82F6',
      icon: icon || 'chart-bar'
    })
    .select()
    .single();

  if (dbError) {
    if (dbError.code === '23505') { // Unique violation
      return error(res, 'Category with this name already exists', 400);
    }
    throw dbError;
  }

  return created(res, data);
}
