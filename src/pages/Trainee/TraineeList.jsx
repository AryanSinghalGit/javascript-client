import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import querystring from 'querystring';
import { Button } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { SnackBarContext } from '../../contexts';
import { Table, AddDialog } from './components';
import { RemoveDialog } from './components';
import { EditDialog } from './components';
import callApi from '../../lib/utils/api';
import traineeList from './data/trainee';
import { COLUMNS, ROWS_PER_PAGE, TRAINEE_PATH, SKIP } from '../../configs/constants';

class TraineeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      order: 'asc',
      orderBy: '',
      page: 0,
      count: 0,
      skip: SKIP,
      limit: ROWS_PER_PAGE,
      traineeData: [],
      deleteDialogOpen: false,
      editDialogOpen: false,
      traineeRecord: {},
      dialogProgressBar: false,
      tableProgressBar: false,
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ dialogProgressBar: true });
    const name = event.target[0].value;
    const email = event.target[2].value;
    const password = event.target[4].value;
    console.log({ name, email, password });
    const { openSnackbar } = this.context;
    callApi('post', TRAINEE_PATH, { name, email, password })
      .then((data) => {
        this.setState({ dialogProgressBar: false, open: false });
        openSnackbar('success', data.message);
      })
      .catch((err) => {
        this.setState({ dialogProgressBar: false, open: false });
        openSnackbar('error', err.message);
      })
  };

  onSelect = (data) => {
    return data;
  }

  onSort = (order, orderBy) => {
    let newOrder = (order === 'asc') ? 'desc' : 'asc';
    this.setState({ order: newOrder, orderBy });
    return orderBy;
  }

  handlePageChange = (page, direction) => {
    let { skip, limit } = this.state;
    if (direction === 'right') {
      page = page + 1;
      skip = (skip + limit);
    }
    else {
      page = page - 1;
      skip = (skip - limit);
    }
    callApi('get', TRAINEE_PATH + '?' + querystring.stringify({ skip, limit }))
      .then((response) => {
        const { data } = response;
        this.setState({ count: data.count, traineeData: data.records });
      })
      .catch((err) => {
        console.log(err);
      })
    this.setState({ page, skip });
  }


  handleEditDialogOpen = (traineeRecord) => {
    this.setState({ traineeRecord, editDialogOpen: true });
  }

  handleDeleteDialogOpen = (traineeRecord) => {
    this.setState({ traineeRecord, deleteDialogOpen: true });
  }

  handleEditDialogClose = () => {
    this.setState({ traineeRecord: {}, editDialogOpen: false });
  }

  handleDeleteDialogClose = () => {
    this.setState({ traineeRecord: {}, deleteDialogOpen: false });
  }

  handleEditSubmit = (event) => {
    event.preventDefault();
    const name = event.target[0].value;
    const email = event.target[2].value;
    console.log('Edited item');
    console.log({ name, email });
    this.setState({ traineeRecord: {}, editDialogOpen: false });
  }

  handleDeleteSubmit = () => {
    const { traineeRecord } = this.state;
    console.log('Deleted item')
    console.log(traineeRecord);
    this.setState({ traineeRecord: {}, deleteDialogOpen: false });
  }

  componentDidMount = () => {
    this.setState({ tableProgressBar: true })
    const { skip, limit } = this.state;
    const { openSnackbar } = this.context;
    callApi('get', TRAINEE_PATH + '?' + querystring.stringify({ skip, limit }))
      .then((response) => {
        const { data } = response;
        this.setState({ count: data.count, traineeData: data.records, tableProgressBar: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ tableProgressBar: false });
        openSnackbar('error', 'OOPS!, No More Trainees');
      })
  }

  render() {
    const {
      open, orderBy, order, page, deleteDialogOpen, editDialogOpen, traineeRecord,
      dialogProgressBar, tableProgressBar, count, traineeData
    } = this.state;
    return (
      <>
        <div align="right">
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            ADD TRAINEE
          </Button>
        </div>
        <AddDialog
          open={open}
          onClose={this.handleClose}
          onSubmit={this.handleSubmit}
          progressBar={dialogProgressBar}
        />
        <br />
        <Table
          id="trainee_id"
          data={traineeData}
          columns={COLUMNS}
          orderBy={orderBy}
          order={order}
          onSort={this.onSort}
          onSelect={this.onSelect}
          action={
            [
              {
                icon: <EditIcon />,
                handler: this.handleEditDialogOpen,
              },
              {
                icon: <DeleteIcon />,
                handler: this.handleDeleteDialogOpen,
              }
            ]
          }
          rowsPerPage={ROWS_PER_PAGE}
          count={count}
          page={page}
          onChangePage={this.handlePageChange}
          progressBar={tableProgressBar}
        />
        <ul>
          {
            traineeList && traineeList.length && traineeList.map((value, index) => (
              <li key={value.name + index}>
                <Link to={`/trainee/${value.id}`}>{value.name}</Link>
              </li>
            ))
          }
        </ul>
        <RemoveDialog
          open={deleteDialogOpen}
          onClose={this.handleDeleteDialogClose}
          onSubmit={this.handleDeleteSubmit}
          data={traineeRecord}
        />
        <EditDialog
          open={editDialogOpen}
          onClose={this.handleEditDialogClose}
          onSubmit={this.handleEditSubmit}
          data={traineeRecord}
        />
      </>
    );
  }
}

TraineeList.contextType = SnackBarContext;

export default TraineeList;
