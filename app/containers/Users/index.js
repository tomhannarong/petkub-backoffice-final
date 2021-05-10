import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import avatarApi from 'dan-api/images/avatars';

// Import Styles
import { withStyles, makeStyles } from '@material-ui/core/styles';
import styles from 'dan-components/Widget/widget-jss';
import classNames from 'classnames';
import Type from 'dan-styles/Typography.scss';
import messageStyles from 'dan-styles/Messages.scss';
import green from '@material-ui/core/colors/green';

// Import Components
import { Helmet } from 'react-helmet';
import Loading from 'dan-components/Loading';
import { PapperBlock } from 'dan-components';

// Import Material-UI
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { InputAdornment, IconButton } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

// Impoort icons
import AddIcon from '@material-ui/icons/Add';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

// Impoort Formik
import { TextField } from "formik-material-ui";
import { Formik, Form, Field } from "formik";

// Import Apollo
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USERS } from './../../apollo/queries';
import { SIGN_UP } from './../../apollo/mutations';

const variantIcon = {
    success: CheckCircleIcon,
    error: ErrorIcon,
  };
  
  const styles1 = theme => ({
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
  });
  
  function MySnackbarContent(props) {
    const {
      classes,
      className,
      message,
      onClose,
      variant,
      ...other
    } = props;
    const Icon = variantIcon[variant];
  
    return (
      <SnackbarContent
        className={classNames(classes[variant], className)}
        aria-describedby="client-snackbar"
        message={(
          <span id="client-snackbar" className={classes.message}>
            <Icon className={classNames(classes.icon, classes.iconVariant)} />
            {message}
          </span>
        )}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={onClose}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
        {...other}
      />
    );
  }
  
  MySnackbarContent.propTypes = {
    classes: PropTypes.object.isRequired,
    message: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['success', 'error',]).isRequired,
  };
  
  MySnackbarContent.defaultProps = {
    onClose: () => {}
  };
  
  const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);
  
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

const useStyles = makeStyles((theme) => ({
    field: {
        marginTop: 16,
    },
    paddingX:{
        paddingLeft: 2,
        paddingRight: 2
    },
}));

function Users(props) {
    const { classes, width } = props;
    const classesLocal = useStyles()

    // Add Show Password
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    // Add Show Password Confirm
    const [ShowPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const handleClickShowPasswordConfirm = () => setShowPasswordConfirm(!ShowPasswordConfirm);
    const handleMouseDownPasswordConfirm = () => setShowPasswordConfirm(!ShowPasswordConfirm);

    const title = 'Dandelion Pro. Blank Page';
    const description = 'Dandelion Pro';

    const { loading, error, data, refetch } = useQuery(QUERY_USERS , {errorPolicy: 'all' , fetchPolicy: 'network-only'});
    const [dataUser, setdataUser] = useState([])
    const [open, setOpen] = useState(false)
    const [messageError, setMessageError] = useState("")
    const [snackbarSuccessOpen, setsnackbarSuccessOpen] = useState(false)

    const [signup, signupErr] = useMutation(SIGN_UP);

    const handleClickOpen = () => {
        setOpen(true)
    };
    const handleClose = () => {
        setOpen(false)
    };

    const handleSuccessOpen = () => {
        setsnackbarSuccessOpen(true)
    };
    const handleSuccessClose = () => {
        setsnackbarSuccessOpen(false)
    };

    const getDataQuery = (data) => {
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

    useEffect(() => {
        if (data){
            getDataQuery(data)
        }
        
    }, [data]);

    useEffect(() => {
        if(signupErr.error){
          signupErr.error.graphQLErrors[0].extensions.exception.validationErrors.map(({constraints,property}, index)=>{
            setMessageError(Object.values(constraints)[0])
            // console.log("error property: " , property)
            // console.log("error constraints: " , Object.values(constraints)[0])   
          })
        }
    }, [signupErr.error])

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
                
                if (value.includes("CLIENT")) {
                    var jsxClient = ( <Chip key={`CLIENT`}  label="CLIENT" color='secondary' className={classesLocal.paddingX}  style={{backgroundColor: "#52a6d8", marginInline: 5}}  /> )
                }
                if (value.includes("ADMIN")) {
                    var jsxAdmin = ( <Chip key={`ADMIN`} label="ADMIN" color="primary" className={classesLocal.paddingX} style={{backgroundColor: "#2D82B5", marginInline: 5}} /> )
                }
                if (value.includes("SUPERADMIN")) {
                    var jsxSuperAdmin = ( <Chip key={`SUPERADMIN`} label="SUPERADMIN" color="primary" className={classesLocal.paddingX} style={{backgroundColor:'#015C92', marginInline: 5}} /> )
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
        {
            name: 'Actions',
            options: {
            filter: false,
            customBodyRender: (value) => (
                <>
                <Tooltip title="user edit" placement="bottom">
                    <IconButton className={classes.button} >
                    <i className="ion-edit" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="user delete" placement="bottom">
                    <IconButton className={classes.button} onClick={()=> alert("123123")}>
                    <i className="ion-ios-trash-outline" />
                    </IconButton>
                </Tooltip>
                {/* <LinearProgress variant="determinate" color="secondary" value={value} /> */}
                </>
                
            )
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

    const showForm = ({ values, setFieldValue, isValid, dirty , isSubmitting }) => {
        return (
          <Form>
                <DialogTitle id="form-dialog-title">Add New User Admin</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Add new user admin for Service and Our clients support.  
                    </DialogContentText>
                    <Snackbar
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                        }}
                        open={snackbarSuccessOpen}
                        autoHideDuration={6000}
                        onClose={handleSuccessClose}
                    >
                        <MySnackbarContentWrapper
                            variant="success"
                            className={classesLocal.field}
                            onClose={handleSuccessClose}
                            message={"Create a New Admin User Success"}
                        />
                    </Snackbar>

                    {messageError && (  
                        <Alert severity="error" className={classesLocal.field}>{messageError}</Alert>
                    )}
                    <Field
                        fullWidth
                        required
                        component={TextField}
                        className={classesLocal.field}
                        name="fname"
                        type="text"
                        label="First Name"
                        variant="outlined"
                    />
                    <br />
                    <Field
                        className={classesLocal.field}
                        fullWidth
                        required
                        component={TextField}
                        name="lname"
                        type="text"
                        label="Last Name"
                        variant="outlined"
                    />
        
                    <Field
                        className={classesLocal.field}
                        fullWidth
                        required
                        component={TextField}
                        name="email"
                        type="email"
                        label="Email"
                        variant="outlined"
                    />    

                    <Field
                        className={classesLocal.field}
                        required
                        fullWidth
                        component={TextField}
                        name="password"
                        label="Password"
                        variant="outlined"
                        type={showPassword ? "text" : "password"} // <-- This is where the magic happens
                        InputProps={{ // <-- This is where the toggle button is added.
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                >
                                  {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            )
                        }}
                        
                    /> 

                    <Field
                        className={classesLocal.field}
                        required
                        fullWidth
                        component={TextField}
                        name="passwordConfirm"
                        type="password"
                        label="Password Confirm"
                        variant="outlined"
                        type={ShowPasswordConfirm ? "text" : "password"} // <-- This is where the magic happens
                        InputProps={{ // <-- This is where the toggle button is added.
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password confirm visibility"
                                  onClick={handleClickShowPasswordConfirm}
                                  onMouseDown={handleMouseDownPasswordConfirm}
                                >
                                  {ShowPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            )
                        }}
                    />   

                    

                    {/* {messageError && (
                        <Typography variant="subtitle1" className={`${Type.textError} ${classesLocal.field}`} gutterBottom>
                            <Error /> <span className={Type.italic}> {messageError} </span>
                        </Typography>   
                    )} */}
                        
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary" variant="contained" disabled={!(isValid && dirty) || isSubmitting}>
                        Save
                    </Button>
                </DialogActions>
            
          </Form>
        );
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
                <Grid>

                    <div className={classes.actions} style={{textAlign: "center", marginBottom: 20}}>
                        <Tooltip title="Add User Admin">
                            <Button variant="contained" onClick={handleClickOpen} color="primary" className={classes.button}>
                            <AddIcon className={classNames(isWidthUp('sm', width) && classes.leftIcon, classes.iconSmall)} />
                            {isWidthUp('sm', width) && 'Add New User Admin'}
                            </Button>
                        </Tooltip>
                    </div>
                    
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="form-dialog-title"
                    >
                        <Formik
                            validate={({fname, lname, email, password, passwordConfirm}) => {
                                let errors = {};
                                if (!fname) errors.fname = "Enter First Name";
                                if (!lname) errors.lname = "Enter Last Name";
                                if (!email) errors.email = "Enter Email";
                                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) 
                                    errors.email = "Invalid email address format";
                                if (!password) errors.password = "Enter password";
                                if (!passwordConfirm) errors.passwordConfirm = "Enter Password Confirm";
                                if (password && passwordConfirm) 
                                    if (password !== passwordConfirm) {
                                        errors.password = "passwords do not match"; 
                                        errors.passwordConfirm = "passwords do not match"; 
                                    }
                                return errors;
                            }}
                            initialValues={{ fname: "", lname: "", email: "", password: "", passwordConfirm: ""}}
                            onSubmit={ ({ fname, lname, email, password, passwordConfirm}, { setSubmitting }) => {
                                // setSubmitting(true)
                                // await new Promise(resolve => setTimeout(resolve, 1000));
                                const variables = { fname, lname, email, password, passwordConfirm }
                                signup({ variables }).then(async(res)=>{
                                    handleSuccessClose()
                                    handleSuccessOpen()
                                    
                                    await refetch().then((response) => response.data).then((result) => {
                                        setdataUser([])
                                        getDataQuery(result)
                                    })
                                    handleClose()

                                    setMessageError("")
                                    setSubmitting(false);
                                }).catch(()=>{
                                    setTimeout(()=>{
                                        setSubmitting(false);
                                    }, 500);
                                })
                               
                            }}
                        >
                            {(props) => showForm(props)}
                            
                            
                            
                        </Formik>
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