import {
  Button,
  FormGroup,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';

import { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import PageTitle from '../../helper-components/PageTitle';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DescriptionIcon from '@mui/icons-material/Description';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import { styled } from '@mui/material/styles';

export default function CreateProduct() {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    images: [],
  });

  const categories = [
    'Laptop',
    'Footwear',
    'Bottom',
    'Tops',
    'Attire',
    'Camera',
    'SmartPhones',
  ];

  function handleSubmit(e) {
    e.preventDefault();
    console.log(product);
  }

  function setValue(e) {
    setProduct({ ...product, [e.target.name]: e.target.value });
  }
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProduct((product) => ({
          ...product,
          images: [...product.images, reader.result],
        }));
      };
    });
  };

  const Input = styled('input')({
    display: 'none',
  });

  return (
    <>
      <PageTitle title="Create product" />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <form className="flex-1 justify-center flex">
          <FormGroup margin="dense" size="small" className="space-y-8 w-80">
            <OutlinedInput
              type="text"
              placeholder="Product name"
              autoComplete="off"
              name="name"
              value={product.name}
              onChange={setValue}
              startAdornment={
                <InputAdornment position="start">
                  <DriveFileRenameOutlineIcon />
                </InputAdornment>
              }
            />
            <OutlinedInput
              type="number"
              placeholder="Price"
              name="price"
              autoComplete="off"
              value={product.price}
              onChange={setValue}
              startAdornment={
                <InputAdornment position="start">
                  <CurrencyRupeeIcon />
                </InputAdornment>
              }
            />

            <OutlinedInput
              type="text"
              placeholder="Description"
              multiline
              name="description"
              value={product.description}
              onChange={setValue}
              startAdornment={
                <InputAdornment position="start">
                  <DescriptionIcon />
                </InputAdornment>
              }
            />
            <OutlinedInput
              type="number"
              placeholder="Stock"
              name="stock"
              value={product.stock}
              onChange={setValue}
              startAdornment={
                <InputAdornment position="start">
                  <Inventory2Icon />
                </InputAdornment>
              }
            />
            <Select
              name="category"
              displayEmpty
              renderValue={(value) =>
                value ? value : <div className="text-gray-400">Category</div>
              }
              value={product.category}
              onChange={setValue}
              startAdornment={
                <InputAdornment position="start">
                  <CategoryIcon />
                </InputAdornment>
              }
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            <label htmlFor="contained-button-file">
              <Input
                accept="image/*"
                id="contained-button-file"
                multiple
                type="file"
                onChange={handleImageChange}
              />
              <Button fullWidth variant="outlined" component="span">
                Upload
              </Button>
            </label>

            <div className="h-20 flex space-x-2 overflow-x-auto px-2">
              {product.images.map((image, index) => (
                <img
                  className="h-full object-cover"
                  key={index}
                  src={image}
                  alt="Product Preview"
                />
              ))}
            </div>

            <Button
              type="submit"
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              color="primary"
            >
              Create
            </Button>
          </FormGroup>
        </form>
      </div>
    </>
  );
}