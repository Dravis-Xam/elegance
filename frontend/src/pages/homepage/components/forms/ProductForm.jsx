import { useMemo, useState } from 'react';
import './product-form.css';
import { toast } from '../../../../modules/ToastStore';
import { uploadImagesToCloudinary } from '../../../../modules/cloudinary';
import { useProduct } from '../../../../modules/ProductContext';
import LiveCard from './component/LiveCard';

const ProductForm = ({ onCancel, isEditing }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [amountInStock, setAmountInStock] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [newAttribute, setNewAttribute] = useState('');
  const [unitQuantity, setUnitQuantity] = useState([]);
  const [newUnit, setNewUnit] = useState('');
  const [thumbnail, setThumbnail] = useState([]);
  const [thumbnailFiles, setThumbnailFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const { addProduct, updateProduct, isLoading } = useProduct();
  const addAttribute = () => {
    const trimmed = newAttribute.trim();
    if (trimmed && !attributes.includes(trimmed)) {
      setAttributes([...attributes, trimmed]);
      setNewAttribute('');
    }
  };

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const addUnit = () => {
    const trimmed = newUnit.trim();
    if (trimmed && !unitQuantity.includes(trimmed)) {
      setUnitQuantity([...unitQuantity, trimmed]);
      setNewUnit('');
    }
  };

  const removeUnit = (index) => {
    setUnitQuantity(unitQuantity.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setThumbnailFiles(prev => [...prev, ...files]);

    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setThumbnail(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setAmountInStock('');
    setAttributes([]);
    setNewAttribute('');
    setUnitQuantity([]);
    setNewUnit('');
    setThumbnail([]);
    setThumbnailFiles([]);
    setPreviewImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const uploadedThumbnails = await uploadImagesToCloudinary(thumbnailFiles);

      const dataToSubmit = {
        name,
        category,
        attributes,
        unitQuantity,
        price: parseFloat(price),
        amountInStock: parseInt(amountInStock),
        thumbnail: [...thumbnail, ...uploadedThumbnails],
      };

      if (isEditing) {
        await updateProduct(dataToSubmit);
      } else {
        await addProduct(dataToSubmit);
      }
      toast.success("Item saved")
      resetForm();
      onCancel();
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    }
  };

  const CardItem = useMemo(()=>({name, category, attributes, unitQuantity, price: parseFloat(price), amountInStock, thumbnail}),[name, category, attributes, unitQuantity, price, amountInStock, thumbnail])

  return (
    <div className="product-form-container">
      <div className='container product-form-inner'>
        <h2 className="product-form__header">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
      
        <form onSubmit={handleSubmit} className='product-form'>
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input form-input--90"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input form-input--90"
            />
          </div>

          <div className="form-group">
            <label>Attributes</label>
            <div className="array-input-container">
              <input
                type="text"
                value={newAttribute}
                onChange={(e) => setNewAttribute(e.target.value)}
                placeholder="Add new attribute"
                className="form-input"
              />
              <button type="button" onClick={addAttribute} className="btn-outline">Add</button>
            </div>
            {attributes.length > 0 && (
              <div className="array-items-container">
                {attributes.map((attr, index) => (
                  <div key={index} className="array-item">
                    {attr}
                    <button type="button" onClick={() => removeAttribute(index)} className="array-item__remove">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Thumbnails *</label>
            <div>
              <input
                type="file"
                id="thumbnails"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                className='button btn-outline'
              />
              <label htmlFor="thumbnails" className="btn-outline file-upload-label">
                Upload Images
              </label>
            </div>
            {previewImages.length > 0 && (
              <div className="thumbnails-grid">
                {previewImages.map((img, index) => (
                  <div key={index} className="thumbnail-container">
                    <img src={img} alt={`Preview ${index + 1}`} className="thumbnail-image" />
                    <button type="button" onClick={() => removeImage(index)} className="thumbnail-remove">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="form-input form-input--90"
            />
          </div>

          <div className="form-group">
            <label>Unit Quantity</label>
            <div className="array-input-container">
              <input
                type="text"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                placeholder="Add unit (e.g., 500ml, 1L)"
                className="form-input"
              />
              <button type="button" onClick={addUnit} className="btn-outline">Add</button>
            </div>
            {unitQuantity.length > 0 && (
              <div className="array-items-container">
                {unitQuantity.map((unit, index) => (
                  <div key={index} className="array-item">
                    {unit}
                    <button type="button" onClick={() => removeUnit(index)} className="array-item__remove">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="amountInStock">Amount in Stock *</label>
            <input
              type="number"
              id="amountInStock"
              value={amountInStock}
              onChange={(e) => setAmountInStock(e.target.value)}
              required
              className="form-input form-input--90"
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => { resetForm(); onCancel(); }} className="btn-outline" disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
      <div className="live-card-container">
        <LiveCard item = {CardItem}/>
      </div>
    </div>
  );
};

export default ProductForm;
