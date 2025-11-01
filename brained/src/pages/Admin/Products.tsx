import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/products';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>({ title: '', price: 0, category: '', image: '', description: '', featured: false });

  const load = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct(form);
      setForm({ title: '', price: 0, category: '', image: '', description: '', featured: false });
      await load();
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      await load();
    } catch (e) { console.error(e); }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>

      <div className="bg-white rounded p-4 shadow mb-6">
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="border p-2 rounded" placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
          <input className="border p-2 rounded" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className="border p-2 rounded" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <textarea className="border p-2 rounded col-span-1 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
          <div>
            <button className="px-4 py-2 bg-orange-500 text-white rounded">Create</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded p-4 shadow">
        <h3 className="font-semibold mb-3">All Products</h3>
        {loading ? <div>Loading...</div> : (
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p._id} className="flex items-center justify-between border rounded p-3">
                <div className="flex items-center gap-3">
                  <img src={p.image || 'https://via.placeholder.com/100'} alt={p.title} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-gray-500">${p.price} • {p.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { const updated = { featured: !p.featured }; updateProduct(p._id, updated).then(load); }} className="px-3 py-1 bg-gray-100 rounded">Toggle Featured</button>
                  <button onClick={() => onDelete(p._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
