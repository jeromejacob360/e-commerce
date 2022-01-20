import {
  Button,
  CircularProgress,
  Fab,
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
import {
  clearErrors,
  fetchProductDetails,
  updateProduct,
} from '../../redux/actions/productActions';
import { useSnackbar } from 'notistack';
import Loading from '../../helper-components/loading/Loading';
import Sidebar from './Sidebar';
const initialState = {
  name: '',
  price: '',
  description: '',
  category: '',
  stock: '',
  images: [],
};

export default function UpdateProduct({ history, match }) {
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

  const {
    loading,
    error,
    product: oldProduct,
  } = useSelector((state) => state.productDetails);

  const {
    error: updateError,
    loading: uploading,
    success,
  } = useSelector((state) => state.product);

  const [product, setProduct] = useState(initialState);

  useEffect(() => {
    dispatch(fetchProductDetails(match.params.id));
  }, [dispatch, match.params.id]);

  useEffect(() => {
    if (oldProduct) {
      setProduct({
        ...oldProduct,
        oldImages: oldProduct?.images,
      });
    }
  }, [oldProduct]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (updateError) {
      enqueueSnackbar(updateError.message, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      history.push('/admin/products');
    }
  }, [error, enqueueSnackbar, dispatch, updateError, success, history]);

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
    dispatch(updateProduct(product));
  }

  function setValue(e) {
    setProduct({ ...product, [e.target.name]: e.target.value });
  }

  function deleteImage(index) {
    if (uploading) return;
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
      <PageTitle title="Update product" />
      <div className="flex flex-col sm:flex-row 2xl:px-10">
        <Sidebar />
        {loading ? (
          <Loading />
        ) : (
          <div className="flex-1">
            <div className="flex flex-col md:flex-row">
              <form className="flex justify-center flex-1">
                <FormGroup
                  margin="dense"
                  size="small"
                  className="space-y-4 w-80"
                >
                  <OutlinedInput
                    disabled={uploading}
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
                    disabled={uploading}
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
                    disabled={uploading}
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
                    disabled={uploading}
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
                    disabled={uploading}
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
                      disabled={uploading}
                      accept="image/*"
                      id="contained-button-file"
                      multiple
                      type="file"
                      onChange={handleImageChange}
                    />

                    <Button
                      disabled={uploading}
                      fullWidth
                      variant="outlined"
                      component="span"
                    >
                      add images
                    </Button>
                  </label>

                  <h4>Selected images (click to remove)</h4>
                  <div className="flex px-2 space-x-1 overflow-x-auto h-28">
                    {product.images &&
                      product.images.map((image, index) => (
                        <img
                          className={`object-cover h-20 ${
                            uploading ? 'opacity-10' : 'cursor-pointer'
                          } w-14`}
                          key={index}
                          src={image.url}
                          onClick={() => deleteImage(index)}
                          alt="Product Preview"
                        />
                      ))}
                  </div>

                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={uploading}
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    update
                  </Button>
                </FormGroup>
              </form>
            </div>
            {uploading && (
              <div className="fixed bottom-10 left-10">
                <Fab color="secondary" aria-label="add">
                  <CircularProgress value={80} />
                </Fab>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
