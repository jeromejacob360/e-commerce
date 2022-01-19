import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors } from '../../redux/actions/productActions';
import Loading from '../../helper-components/loading/Loading';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PageTitle from '../../helper-components/PageTitle';
import { useSnackbar } from 'notistack';
import { Button, MenuItem, Select } from '@mui/material';
import {
  deleteUser,
  fetchAllUsers,
  updateUser,
} from '../../redux/actions/userActions';

export default function UsersList() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { loading, users } = useSelector((state) => state.allUsers);
  const { success, error } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch, success]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar('Done!', { variant: 'success' });
      dispatch({
        type: 'RESET_PROFILE_UPDATE',
      });
    }
  }, [error, enqueueSnackbar, dispatch, success]);

  function deleteHandler(id) {
    dispatch(deleteUser(id));
  }

  function updateUserHandler(id, role) {
    dispatch(updateUser(id, role));
  }

  const rows = [];
  users &&
    users.forEach((user) => {
      rows.push({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    });

  const columns = [
    {
      field: 'id',
      headerName: 'User ID',
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <Link to={`/user/${params.row.id}`}>
            <span>{params.value}</span>
          </Link>
        );
      },
    },

    {
      field: 'name',
      headerName: 'Name',
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 180,
      flex: 0.3,
    },

    {
      field: 'role',
      headerName: 'Role',
      type: 'text',
      minWidth: 100,
      flex: 0.5,
      headerAlign: 'center',

      renderCell: (params) => {
        if (params.row.id === user._id) {
          return (
            <div className="flex-1 text-center capitalize">
              {params.row.role} (me)
            </div>
          );
        }
        return (
          <>
            <Select
              name="role"
              fullWidth
              value={params.row.role}
              onChange={(e) => updateUserHandler(params.row.id, e.target.value)}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </>
        );
      },
      cellClassName: (params) => {
        return params.value === 'admin' ? 'text-green-700' : 'text-red-800';
      },
    },

    {
      field: 'actions',
      headerAlign: 'center',
      flex: 0.3,
      headerName: 'Delete user',
      minWidth: 100,
      type: 'text',
      sortable: false,
      renderCell: (params) => {
        if (params.row.id === user._id) {
          return null;
        }
        return (
          <Button onClick={() => deleteHandler(params.row.id)}>
            <DeleteOutlineIcon />
          </Button>
        );
      },
    },
  ];

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <PageTitle title="All Users" />
      <div className="flex-1">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
          getRowClassName={(params) =>
            params.row.stock < 1 ? 'bg-red-400 bg-opacity-10' : ''
          }
        />
      </div>
    </>
  );
}
