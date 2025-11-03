const { supabase } = require('../../lib/supabase');
const { success, error, notFound } = require('../../lib/response');
const { corsMiddleware } = require('../../lib/cors');

module.exports = async (req, res) => {
  await corsMiddleware(req, res);

  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      return await getCategoryById(id, res);
    } else if (req.method === 'PUT') {
      return await updateCategory(id, req.body, res);
    } else if (req.method === 'DELETE') {
      return await deleteCategory(id, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Category API Error:', err);
    return error(res, err.message);
  }
};

async function getCategoryById(id, res) {
  const { data: category, error: dbError } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (dbError) {
    if (dbError.code === 'PGRST116') {
      return notFound(res, 'Category not found');
    }
    throw dbError;
  }

  // Get associated KPIs
  const { data: kpis, error: kpisError } = await supabase
    .from('kpis')
    .select('*')
    .eq('category_id', id);

  if (kpisError) throw kpisError;

  return success(res, {
    ...category,
    kpis
  });
}

async function updateCategory(id, body, res) {
  const updateData = {};

  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.color !== undefined) updateData.color = body.color;
  if (body.icon !== undefined) updateData.icon = body.icon;

  const { data, error: dbError } = await supabase
    .from('categories')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (dbError) {
    if (dbError.code === 'PGRST116') {
      return notFound(res, 'Category not found');
    }
    if (dbError.code === '23505') {
      return error(res, 'Category with this name already exists', 400);
    }
    throw dbError;
  }

  return success(res, data);
}

async function deleteCategory(id, res) {
  // Check if category has KPIs
  const { count, error: countError } = await supabase
    .from('kpis')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', id);

  if (countError) throw countError;

  if (count > 0) {
    return error(res, `Cannot delete category with ${count} associated KPIs`, 400);
  }

  const { error: dbError } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (dbError) throw dbError;

  return success(res, {});
}
