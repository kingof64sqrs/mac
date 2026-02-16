import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { categoriesAPI, sectionsAPI } from '../services/api';
import { Plus, Edit2, Trash2, X, Search, MoreHorizontal, FolderTree } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, sectionsRes] = await Promise.all([
        categoriesAPI.list(),
        sectionsAPI.list(),
      ]);
      setCategories(categoriesRes.data.data || []);
      setSections(sectionsRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      reset(category);
    } else {
      reset({ name: '', slug: '', description: '', section_id: '', is_active: true });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, data);
        toast.success('Category updated successfully!');
      } else {
        await categoriesAPI.create(data);
        toast.success('Category created successfully!');
      }
      closeModal();
      fetchData();
    } catch (error) {
      toast.error('Failed to save category');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoriesAPI.delete(id);
      toast.success('Category deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete category');
      console.error(error);
    }
  };

  const getSectionName = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    return section ? section.name : '-';
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-dark-900">Categories</h1>
          <p className="text-dark-500 mt-1">Organize your products into categories</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-dark-100">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2.5 bg-dark-50 border border-dark-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-dark-400" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-dark-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-dark-100">
            <thead className="bg-dark-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-dark-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-dark-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-dark-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-dark-50 rounded-full flex items-center justify-center mb-4">
                        <FolderTree className="w-8 h-8 text-dark-300" />
                      </div>
                      <p className="text-lg font-medium text-dark-900">No categories found</p>
                      <p className="text-sm mt-1">Try adjusting your search or add a new category.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <motion.tr
                    key={category.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-dark-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-dark-900">{category.name}</div>
                      <div className="text-xs text-dark-500 truncate max-w-xs">{category.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {getSectionName(category.section_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-dark-600 font-mono bg-dark-50 px-2 py-1 rounded inline-block">
                        {category.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx(
                        "px-2.5 py-0.5 inline-flex text-xs leading-4 font-semibold rounded-full border",
                        category.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-dark-100 text-dark-600 border-dark-200'
                      )}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openModal(category)}
                          className="p-1.5 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-dark-900/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-dark-100">
                <h2 className="text-xl font-bold font-heading text-dark-900">
                  {editingCategory ? 'Edit Category' : 'New Category'}
                </h2>
                <button onClick={closeModal} className="p-2 text-dark-400 hover:text-dark-600 hover:bg-dark-50 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div>
                  <label className="label">Name</label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="input-field"
                    placeholder="e.g. T-Shirts"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="label">Section</label>
                  <div className="relative">
                    <select
                      {...register('section_id', { required: 'Section is required' })}
                      className="input-field appearance-none"
                    >
                      <option value="">Select a section</option>
                      {sections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-dark-400">
                      <MoreHorizontal className="w-4 h-4 transform rotate-90" />
                    </div>
                  </div>
                  {errors.section_id && <p className="text-red-500 text-sm mt-1">{errors.section_id.message}</p>}
                </div>

                <div>
                  <label className="label">Slug</label>
                  <input
                    type="text"
                    {...register('slug')}
                    className="input-field"
                    placeholder="auto-generated if empty"
                  />
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    {...register('description')}
                    className="input-field"
                    rows="3"
                    placeholder="Optional description"
                  />
                </div>

                <div className="flex items-center p-3 bg-dark-50 rounded-lg border border-dark-100">
                  <input
                    type="checkbox"
                    {...register('is_active')}
                    className="w-4 h-4 text-violet-600 border-dark-300 rounded focus:ring-violet-500"
                  />
                  <label className="ml-2 text-sm font-medium text-dark-700">Active Category</label>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingCategory ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Categories;
