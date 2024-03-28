import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel, 
  Grid,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  RadioGroup,
  Radio,
  Autocomplete,
  Chip,
  InputAdornment,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
// import AlertUniversityDelete from './AlertUniversityDelete';
import AlertRoomDelete from './AlertRoomDelete';
// import //AlertUniversityDelete from './AlertUniversityDelete';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';

import { openSnackbar } from 'api/snackbar';
import { insertCustomer, updateCustomer } from 'api/customer';
import { ThemeMode } from 'config';
import { Gender } from 'data/react-table';
import { getImageUrl, ImagePath } from 'utils/getImageUrl';

// assets
import { CameraOutlined, CloseOutlined, DeleteFilled, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { dispatch } from 'store';
// import { createUniversity, getUniversities, updateUniversity } from 'store/reducers/university';
import { createRoom,  getRooms, updateRoom } from 'store/reducers/room';
import { useDispatch } from 'store';
import countries from 'data/countries';
import { Icon } from '@iconify/react';


const skills = [
  'Adobe XD',
  'After Effect',
  'Angular',
  'Animation',
  'ASP.Net',
  'Bootstrap',
  'C#',
  'CC',
  'Corel Draw',
  'CSS',
  'DIV',
  'Dreamweaver',
  'Figma',
  'Graphics',
  'HTML',
  'Illustrator',
  'J2Ee',
  'Java',
  'Javascript',
  'JQuery',
  'Logo Design',
  'Material UI',
  'Motion',
  'MVC',
  'MySQL',
  'NodeJS',
  'npm',
  'Photoshop',
  'PHP',
  'React',
  'Redux',
  'Reduxjs & tooltit',
  'SASS',
  'SCSS',
  'SQL Server',
  'SVG',
  'UI/UX',
  'User Interface Designing',
  'Wordpress'
];




// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

const FormRoomAdd = ({ room, closeModal }) => { 
  console.log("room delete", room);
  const theme = useTheme();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [avatar, setAvatar] = useState(
    getImageUrl(`avatar-${room &&
       room !== null && 
       room?.avatar ? room.avatar : 1}.png`,
        ImagePath.USERS)
  );

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (selectedImage) {
      setAvatar(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  useEffect(() => {
    setLoading(false);
  }, []);



  const RoomSchema = Yup.object().shape({
    roomId: Yup.number().required('Room ID is required'),
    hotelId: Yup.number().required('Hotel ID is required'),
    type: Yup.string().max(50).required('Type is required'),
    capacity: Yup.number().required('Capacity is required'),
    price: Yup.number().required('Price is required'),
    commissionRate: Yup.number().required('Commission Rate is required'),
    adminApproval: Yup.boolean().required('Admin Approval is required'),
    roomType: Yup.string().max(50).required('Room Type is required'),
    beddingOptions: Yup.string().max(50).required('Bedding Options is required'),
    roomSize: Yup.string().max(50).required('Room Size is required'),
    roomView: Yup.string().max(50).required('Room View is required'),
    roomOccupancy: Yup.string().max(50).required('Room Occupancy is required'),
    bathroom: Yup.string().max(50).required('Bathroom is required'),
    roomAccessibility: Yup.string().max(50).required('Room Accessibility is required'),
    roomFeatures: Yup.string().max(50).required('Room Features is required'),
  });

  const defaultValues = useMemo(
    () => ({
      roomId: room ? room.roomId : '',
      hotelId: room ? room.hotelId : '',
      type: room ? room.type : '',
      capacity: room ? room.capacity : '',
      price: room ? room.price : '',
      commissionRate: room ? room.commissionRate : '',
      adminApproval: room ? room.adminApproval : false,
      roomType: room ? room.roomType : '',
      beddingOptions: room ? room.beddingOptions : '',
      roomSize: room ? room.roomSize : '',
      roomView: room ? room.roomView : '',
      roomOccupancy: room ? room.roomOccupancy : '',
      bathroom: room ? room.bathroom : '',
      roomAccessibility: room ? room.roomAccessibility : '',
      roomFeatures: room ? room.roomFeatures : '',
    }),
    [room]
  );

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: RoomSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      console.log("values uni new", values);
      try {
        let newRoom = values;

        if (room) {
          dispatch(updateRoom(room._id, newRoom)).then(() => {
            openSnackbar({
              open: true,
              message: 'Room update successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              }
            });
            setSubmitting(false);
            dispatch(getRooms());
            closeModal();
          });
        } else {
          dispatch(createRoom(values)).then(() => {
            openSnackbar({
              open: true,
              message: 'Room added successfully.',
              variant: 'alert',
              alert: {
                color: 'success'
              }
            });
            setSubmitting(false);
            dispatch(getRooms());
            closeModal();
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  useEffect(() => {
    dispatch(getRooms());
  }, [dispatch]);

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  if (loading)
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );

    return (
      <>
        <FormikProvider value={formik}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <DialogTitle>{room ? 'Edit Room' : 'New Room'}</DialogTitle>
              <Divider />
              <DialogContent sx={{ p: 5.5 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="roomId"
                      label="Room ID"
                      placeholder="Enter Room ID. E.g.-1"
                      {...getFieldProps('roomId')}
                      error={Boolean(touched.roomId && errors.roomId)}
                      helperText={touched.roomId && errors.roomId}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="hotelId"
                      label="Hotel ID"
                      placeholder="Enter Hotel ID. E.g.-1"
                      {...getFieldProps('hotelId')}
                      error={Boolean(touched.hotelId && errors.hotelId)}
                      helperText={touched.hotelId && errors.hotelId}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="type"
                      label="Type"
                      placeholder="Enter Type. E.g.-Standard"
                      {...getFieldProps('type')}
                      error={Boolean(touched.type && errors.type)}
                      helperText={touched.type && errors.type}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="capacity"
                      label="Capacity"
                      placeholder="Enter Capacity. E.g.-1"
                      {...getFieldProps('capacity')}
                      error={Boolean(touched.capacity && errors.capacity)}
                      helperText={touched.capacity && errors.capacity}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="price"
                      label="Price"
                      placeholder="Enter Price. E.g.-20000"
                      {...getFieldProps('price')}
                      error={Boolean(touched.price && errors.price)}
                      helperText={touched.price && errors.price}
                      type="number"
                    />
                    </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="commissionRate"
                    label="Commission Rate"
                    placeholder="Enter Commission Rate. E.g.-5"
                    {...getFieldProps('commissionRate')}
                    error={Boolean(touched.commissionRate && errors.commissionRate)}
                    helperText={touched.commissionRate && errors.commissionRate}
                    />
                  </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Admin Approval</FormLabel>
                    <RadioGroup
                      row
                      {...getFieldProps('adminApproval')}
                      value={formik.values.adminApproval.toString()}
                      onChange={(e) => formik.setFieldValue('adminApproval', e.target.value === 'true')}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Yes" />
                      <FormControlLabel value="false" control={<Radio />} label="No" />
                    </RadioGroup>
                    {errors.adminApproval && touched.adminApproval && (
                      <FormHelperText error>{errors.adminApproval}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="roomType"
                    label="Room Type"
                    placeholder="Enter Room Type. E.g,-Single"
                    {...getFieldProps('roomType')}
                    error={Boolean(touched.roomType && errors.roomType)}
                    helperText={touched.roomType && errors.roomType}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="beddingOptions"
                    label="Bedding Options"
                    placeholder="Enter Bedding Options. E.g,-Double"
                    {...getFieldProps('beddingOptions')}
                    error={Boolean(touched.beddingOptions && errors.beddingOptions)}
                    helperText={touched.beddingOptions && errors.beddingOptions}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="roomSize"
                    label="Room Size"
                    placeholder="Enter Room Size. E.g.-20 sqm"
                    {...getFieldProps('roomSize')}
                    error={Boolean(touched.roomSize && errors.roomSize)}
                    helperText={touched.roomSize && errors.roomSize}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="roomView"
                    label="Room View"
                    placeholder="Enter Room View. E.g.-City View"
                    {...getFieldProps('roomView')}
                    error={Boolean(touched.roomView && errors.roomView)}
                    helperText={touched.roomView && errors.roomView}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="roomOccupancy"
                    label="Room Occupancy"
                    placeholder="Enter Room Occupancy. E.g.-2 Adults, 1 Child"
                    {...getFieldProps('roomOccupancy')}
                    error={Boolean(touched.roomOccupancy && errors.roomOccupancy)}
                    helperText={touched.roomOccupancy && errors.roomOccupancy}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="bathroom"
                    label="Bathroom"
                    placeholder="Enter Bathroom. E.g.-Shared"
                    {...getFieldProps('bathroom')}
                    error={Boolean(touched.bathroom && errors.bathroom)}
                    helperText={touched.bathroom && errors.bathroom}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="roomAccessibility"
                    label="Room Accessibility"
                    placeholder="Enter Room Accessibility. E.g.-Wheelchair Accessible"
                    {...getFieldProps('roomAccessibility')}
                    error={Boolean(touched.roomAccessibility && errors.roomAccessibility)}
                    helperText={touched.roomAccessibility && errors.roomAccessibility}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="roomFeatures"
                    label="Room Features"
                    placeholder="Enter Room Features. E.g.-Wi-Fi, TV, Air Conditioning"
                    {...getFieldProps('roomFeatures')}
                    error={Boolean(touched.roomFeatures && errors.roomFeatures)}
                    helperText={touched.roomFeatures && errors.roomFeatures}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Button color="error" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {room ? 'Edit' : 'Add'}
              </Button>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
    </>
  );
};

FormRoomAdd.propTypes = {
  room: PropTypes.object,
  closeModal: PropTypes.func,
};

export default FormRoomAdd;
