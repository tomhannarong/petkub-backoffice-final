import React, { useContext, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '@material-ui/core/Chip';
import MUIDataTable from 'mui-datatables';
import Loading from 'dan-components/Loading';
import Avatar from '@material-ui/core/Avatar';
import avatarApi from 'dan-api/images/avatars';
import { Helmet } from 'react-helmet';
import { PapperBlock } from 'dan-components';
import { useQuery } from '@apollo/client';
import { QUERY_USERS } from './../../apollo/queries';
import styles from 'dan-components/Widget/widget-jss';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import AddIcon from '@material-ui/icons/Add';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';

function Users(props) {
    const { classes, width } = props;

    const title = 'Dandelion Pro. Blank Page';
    const description = 'Dandelion Pro';

    const { loading, error, data } = useQuery(QUERY_USERS , {errorPolicy: 'all' , fetchPolicy: 'network-only'});
    const [dataUser, setdataUser] = useState([])
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    };

    const handleClose = () => {
        setOpen(false)
    };
 
    useEffect(() => {
        if (data){
            for (let v of data.users) {
                const {fname, lname} = v.personalInformation
                let _arr = []
                _arr.push(v.profileImg ? v.profileImg : '-')
                _arr.push(`${fname?fname:'-'} ${lname?lname:'-'}`)
                _arr.push(v.email)
                _arr.push(Math.floor(Math.random() * 101))
                _arr.push(v.roles)
                _arr.push(v.deletedAt?'non-active':'active')
                

                setdataUser( dataUser => [...dataUser, _arr]);
            }   
        }
        console.log("styles2 : " , classes)
    }, [data]);

    useEffect(() => {
        if(dataUser) console.log("arr : " , dataUser)
    }, [dataUser])

    const columns = [
        {
            name: 'Profile',
            options: {
                filter: false,
                customBodyRender: (value) => (
                    <Avatar  alt={value} src={avatarApi[Math.floor(Math.random() * 11)]} className={classes.avatar} />
                )
            }
        },
        {
            name: 'Name',
            options: {
                filter: true
            }
        },
        {
            name: 'Email',
            options: {
                filter: true
            }
        },
        {
            name: 'KPI',
            options: {
            filter: false,
            customBodyRender: (value) => (
                <LinearProgress variant="determinate" color="secondary" value={value} />
            )
            }
        },
        {
            name: 'Role',
            options: {
            filter: true,
            customBodyRender: (value, tableMeta,) => {
                // console.log("tableMeta : ",tableMeta)
                
                if (value.includes("CLIENT")) {
                    var jsxClient = ( <Chip key={`CLIENT`}  label="CLIENT" color='secondary' paddingX={2}  style={{backgroundColor: "#52a6d8", marginInline: 5}}  /> )
                }
                if (value.includes("ADMIN")) {
                    var jsxAdmin = ( <Chip key={`ADMIN`} label="ADMIN" color="primary" paddingX={2} style={{backgroundColor: "#2D82B5", marginInline: 5}} /> )
                }
                if (value.includes("SUPERADMIN")) {
                    var jsxSuperAdmin = ( <Chip key={`SUPERADMIN`} label="SUPERADMIN" color="primary" style={{backgroundColor:'#015C92', marginInline: 5}} /> )
                }
                return ([jsxClient, jsxAdmin, jsxSuperAdmin]);
                // return (<Chip label="Unknown" />);
            }
            }
        },
        {
            name: 'Status',
            options: {
            filter: true,
            customBodyRender: (value) => {
                if (value === 'active') {
                return (<Chip label="Active" color="primary" />);
                }
                if (value === 'non-active') {
                return (<Chip label="Non Active" color="secondary" />);
                }
                return (<Chip label="Unknown" />);
            }
            }
        },
    ];

      const options = {
        filterType: 'dropdown',
        responsive: 'stacked',
        print: true,
        rowsPerPage: 10,
        page: 0
      };

return loading ? (
        <Loading />
    ) : error ? (
        <Loading />
    ) :
    ( 
        <>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="twitter:title" content={title} />
                <meta property="twitter:description" content={description} />
            </Helmet>
            <PapperBlock title="Users Table" noMargin icon="md-contact" desc="Display data for the users from users table.">
                <Grid 
                    alignItems="center"
                    justify="space-evenly"
                    direction="column"
                >

                    <Typography gutterBottom style={{textAlign: "center", marginBottom: 20}} >
                            <div className={classes.actions}>
                                <Tooltip title="Add User Admin">
                                    <Button variant="contained" onClick={handleClickOpen} color="primary" className={classes.button}>
                                    <AddIcon className={classNames(isWidthUp('sm', width) && classes.leftIcon, classes.iconSmall)} />
                                    {isWidthUp('sm', width) && 'Add New User Admin'}
                                    </Button>
                                </Tooltip>
                            </div>
                    </Typography>
                    

                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">Add New User Admin</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Add new user admin for Service and Our clients support.  
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="fname"
                                label="First Name"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="lname"
                                label="Last Name"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="name"
                                label="Email Address"
                                type="email"
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="password"
                                label="Password"
                                type="text"
                                fullWidth
                            />
                            <TextField
                                margin="dense"
                                id="passwordConfirm"
                                label="password Confirm"
                                type="text"
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleClose} color="primary">
                            Save
                        </Button>
                        </DialogActions>
                    </Dialog>

                    <div className={classes.usersTableStyle}>
                        <MUIDataTable
                            title="Users Data"
                            data={dataUser}
                            columns={columns}
                            options={options}
                            
                        />
                    </div>
                </Grid>
            </PapperBlock>
        </>
    )
}


Users.propTypes = {
    classes: PropTypes.object.isRequired
};
  
  export default withWidth()(withStyles(styles)(Users)) ;