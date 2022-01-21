import {
  Button,
  FormGroup,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';

import { useEffect, useState } from 'react';
import PageTitle from '../../helper-components/PageTitle';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DescriptionIcon from '@mui/icons-material/Description';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, createProduct } from '../../redux/actions/productActions';
import { useSnackbar } from 'notistack';
import Loading from '../../helper-components/Loading';
import Sidebar from './Sidebar';

const initialState = {
  name: '',
  price: '',
  description: '',
  category: '',
  stock: '',
  images: [],
};

export default function CreateProduct() {
  const [product, setProduct] = useState(initialState);
  const categories = [
    'Laptop',
    'Footwear',
    'Bottom',
    'Tops',
    'Attire',
    'Camera',
    'SmartPhones',
  ];

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { error, loading, success } = useSelector((state) => state.newProduct);
  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar('Product created successfully', { variant: 'success' });
      dispatch(clearErrors());
      setProduct(initialState);
    }
  }, [error, enqueueSnackbar, dispatch, success]);

  function handleSubmit(e) {
    e.preventDefault();
    if (
      !product.name ||
      !product.price ||
      !product.description ||
      !product.category ||
      !product.stock
    ) {
      enqueueSnackbar('Please fill all the fields', {
        variant: 'error',
      });
      return;
    }
    dispatch(createProduct({ ...product, rating: 0 }));
  }

  function setValue(e) {
    setProduct({ ...product, [e.target.name]: e.target.value });
  }

  function deleteImage(index) {
    const images = [...product.images];
    images.splice(index, 1);
    setProduct({ ...product, images });
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProduct((product) => ({
          ...product,
          images: [...product.images, { url: reader.result }],
        }));
      };
    });
  };

  const Input = styled('input')({
    display: 'none',
  });

  return (
    <div className="flex flex-col">
      <PageTitle title="Create product" />
      <div className="flex flex-col sm:flex-row 2xl:px-10">
        <Sidebar />
        {loading ? (
          <Loading />
        ) : (
          <div className="flex justify-center flex-1 sm:ml-44">
            <form className="flex justify-center flex-1 w-96">
              <FormGroup margin="dense" size="small" className="space-y-4 w-80">
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
                <Select
                  name="category"
                  displayEmpty
                  renderValue={(value) =>
                    value ? (
                      value
                    ) : (
                      <div className="text-gray-400">Category</div>
                    )
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
                    data-testid="select-images-button"
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={handleImageChange}
                  />
                  <Button fullWidth variant="outlined" component="span">
                    Select images
                  </Button>
                </label>

                <div className="flex px-2 space-x-1 overflow-x-auto h-28">
                  {product.images.length > 0 &&
                    product.images.map((image, index) => (
                      <img
                        className="object-cover h-20 cursor-pointer w-14"
                        key={index}
                        src={image.url}
                        onClick={() => deleteImage(index)}
                        alt="Product Preview"
                      />
                    ))}
                </div>

                <Button
                  data-testid="submit-create-button"
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
        )}
      </div>
    </div>
  );
}
