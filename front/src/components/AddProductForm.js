import React, { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  TextField as MuiTextField,
  Button as MuiButton,
  Paper,
  Typography,
  Grid,
  Box,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';

function AddProductForm({ onProductAdded }) {
  const { theme: appTheme } = useTheme();
  const isDarkMode = appTheme === 'dark';
  const [formLibrary, setFormLibrary] = useState('bootstrap');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    size: '',
    color: '',
    material: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Пожалуйста, выберите изображение');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Размер файла не должен превышать 5MB');
        return;
      }
      setFormData({
        ...formData,
        image: file
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация
    if (!formData.name.trim()) {
      alert('Введите название товара');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Введите корректную цену');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('size', formData.size);
    formDataToSend.append('color', formData.color);
    formDataToSend.append('material', formData.material);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      await axios.post('http://localhost:8080/api/products/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Товар успешно добавлен!');
      setFormData({
        name: '',
        description: '',
        price: '',
        size: '',
        color: '',
        material: '',
        image: null
      });
      setImagePreview('');

      if (onProductAdded) onProductAdded();
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
      alert('Ошибка при добавлении товара: ' + (error.response?.data?.error || error.message));
    }
  };

  const BootstrapForm = () => (
    <div className="card" style={{
      background: isDarkMode ? '#2d2d2d' : '#fff',
      color: isDarkMode ? '#fff' : '#333',
      border: isDarkMode ? '1px solid #444' : '1px solid #e0e0e0'
    }}>
      <div className="card-body">
        <h5 className="card-title" style={{
          color: isDarkMode ? '#a8d8ff' : '#1a4b6d',
          marginBottom: '20px',
          borderLeft: '4px solid #d94a2c',
          paddingLeft: '15px'
        }}>
          Форма (Bootstrap) - с загрузкой изображения
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: isDarkMode ? '#bbb' : '#333' }}>
              Название *
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                background: isDarkMode ? '#3d3d3d' : '#fff',
                color: isDarkMode ? '#fff' : '#333',
                border: isDarkMode ? '1px solid #555' : '1px solid #ced4da'
              }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: isDarkMode ? '#bbb' : '#333' }}>
              Описание
            </label>
            <textarea
              className="form-control"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              style={{
                background: isDarkMode ? '#3d3d3d' : '#fff',
                color: isDarkMode ? '#fff' : '#333',
                border: isDarkMode ? '1px solid #555' : '1px solid #ced4da'
              }}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ color: isDarkMode ? '#bbb' : '#333' }}>
                Цена *
              </label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                style={{
                  background: isDarkMode ? '#3d3d3d' : '#fff',
                  color: isDarkMode ? '#fff' : '#333',
                  border: isDarkMode ? '1px solid #555' : '1px solid #ced4da'
                }}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ color: isDarkMode ? '#bbb' : '#333' }}>
                Размер
              </label>
              <input
                type="text"
                className="form-control"
                name="size"
                value={formData.size}
                onChange={handleChange}
                style={{
                  background: isDarkMode ? '#3d3d3d' : '#fff',
                  color: isDarkMode ? '#fff' : '#333',
                  border: isDarkMode ? '1px solid #555' : '1px solid #ced4da'
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ color: isDarkMode ? '#bbb' : '#333' }}>
                Цвет
              </label>
              <input
                type="text"
                className="form-control"
                name="color"
                value={formData.color}
                onChange={handleChange}
                style={{
                  background: isDarkMode ? '#3d3d3d' : '#fff',
                  color: isDarkMode ? '#fff' : '#333',
                  border: isDarkMode ? '1px solid #555' : '1px solid #ced4da'
                }}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label" style={{ color: isDarkMode ? '#bbb' : '#333' }}>
                Материал
              </label>
              <input
                type="text"
                className="form-control"
                name="material"
                value={formData.material}
                onChange={handleChange}
                style={{
                  background: isDarkMode ? '#3d3d3d' : '#fff',
                  color: isDarkMode ? '#fff' : '#333',
                  border: isDarkMode ? '1px solid #555' : '1px solid #ced4da'
                }}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: isDarkMode ? '#bbb' : '#333' }}>
              Изображение товара
            </label>
            <input
              type="file"
              className="form-control"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              style={{
                background: isDarkMode ? '#3d3d3d' : '#fff',
                color: isDarkMode ? '#fff' : '#333',
                border: isDarkMode ? '1px solid #555' : '1px solid #ced4da'
              }}
            />
            <small className="form-text text-muted">
              Поддерживаемые форматы: JPEG, PNG, GIF. Максимальный размер: 5MB
            </small>
          </div>
          {imagePreview && (
            <div className="mb-3 text-center">
              <img
                src={imagePreview}
                alt="Предпросмотр"
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              background: '#1a4b6d',
              border: 'none',
              padding: '10px 20px',
              width: '100%'
            }}
          >
            Добавить товар (Bootstrap)
          </button>
        </form>
      </div>
    </div>
  );

  const StyledPaper = styled(Paper)(({ isDarkMode }) => ({
    padding: '25px',
    background: isDarkMode ? '#2d2d2d' : '#ffffff',
    borderRadius: '15px',
    boxShadow: isDarkMode
      ? '0 4px 20px rgba(0,0,0,0.5)'
      : '0 4px 20px rgba(0,0,0,0.1)',
    border: isDarkMode ? '1px solid #444' : 'none'
  }));

  const MaterialForm = () => (
    <StyledPaper elevation={3} isDarkMode={isDarkMode}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: isDarkMode ? '#a8d8ff' : '#1a4b6d',
          marginBottom: '20px',
          borderLeft: '4px solid #d94a2c',
          paddingLeft: '15px'
        }}
      >
        Форма (Material-UI) - с загрузкой изображения
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MuiTextField
              fullWidth
              label="Название товара *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDarkMode ? '#fff' : 'inherit',
                  '& fieldset': {
                    borderColor: isDarkMode ? '#555' : 'rgba(0,0,0,0.23)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#aaa' : 'inherit',
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiTextField
              fullWidth
              label="Описание"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={2}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDarkMode ? '#fff' : 'inherit',
                  '& fieldset': {
                    borderColor: isDarkMode ? '#555' : 'rgba(0,0,0,0.23)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#aaa' : 'inherit',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MuiTextField
              fullWidth
              label="Цена *"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">₽</InputAdornment>,
                sx: { color: isDarkMode ? '#fff' : 'inherit' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: isDarkMode ? '#555' : 'rgba(0,0,0,0.23)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#aaa' : 'inherit',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MuiTextField
              fullWidth
              label="Размер"
              name="size"
              value={formData.size}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDarkMode ? '#fff' : 'inherit',
                  '& fieldset': {
                    borderColor: isDarkMode ? '#555' : 'rgba(0,0,0,0.23)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#aaa' : 'inherit',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MuiTextField
              fullWidth
              label="Цвет"
              name="color"
              value={formData.color}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDarkMode ? '#fff' : 'inherit',
                  '& fieldset': {
                    borderColor: isDarkMode ? '#555' : 'rgba(0,0,0,0.23)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#aaa' : 'inherit',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <MuiTextField
              fullWidth
              label="Материал"
              name="material"
              value={formData.material}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: isDarkMode ? '#fff' : 'inherit',
                  '& fieldset': {
                    borderColor: isDarkMode ? '#555' : 'rgba(0,0,0,0.23)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#aaa' : 'inherit',
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <MuiButton
              variant="outlined"
              component="label"
              fullWidth
              sx={{
                padding: '10px',
                borderColor: isDarkMode ? '#555' : '#ccc',
                color: isDarkMode ? '#fff' : 'inherit',
                '&:hover': {
                  borderColor: isDarkMode ? '#a8d8ff' : '#1a4b6d',
                }
              }}
            >
              Загрузить изображение
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </MuiButton>
            {formData.image && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: isDarkMode ? '#aaa' : '#666' }}>
                Выбран файл: {formData.image.name}
              </Typography>
            )}
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: isDarkMode ? '#888' : '#999' }}>
              Поддерживаемые форматы: JPEG, PNG, GIF. Максимальный размер: 5MB
            </Typography>
          </Grid>
          {imagePreview && (
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <img
                src={imagePreview}
                alt="Предпросмотр"
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  borderRadius: '8px',
                  border: '1px solid #ddd'
                }}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <MuiButton
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                marginTop: '15px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '12px',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                }
              }}
            >
              Добавить товар (Material-UI)
            </MuiButton>
          </Grid>
        </Grid>
      </Box>
    </StyledPaper>
  );

  return (
    <div>
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        justifyContent: 'center'
      }}>
        <button
          onClick={() => setFormLibrary('bootstrap')}
          style={{
            padding: '10px 20px',
            borderRadius: '30px',
            border: 'none',
            cursor: 'pointer',
            background: formLibrary === 'bootstrap'
              ? '#1a4b6d'
              : isDarkMode ? '#3d3d3d' : '#f0f0f0',
            color: formLibrary === 'bootstrap'
              ? 'white'
              : isDarkMode ? '#fff' : '#333',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          Bootstrap форма
        </button>
        <button
          onClick={() => setFormLibrary('material')}
          style={{
            padding: '10px 20px',
            borderRadius: '30px',
            border: 'none',
            cursor: 'pointer',
            background: formLibrary === 'material'
              ? '#764ba2'
              : isDarkMode ? '#3d3d3d' : '#f0f0f0',
            color: formLibrary === 'material'
              ? 'white'
              : isDarkMode ? '#fff' : '#333',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
        >
          Material-UI форма
        </button>
      </div>
      {formLibrary === 'bootstrap' ? <BootstrapForm /> : <MaterialForm />}
    </div>
  );
}

export default AddProductForm;