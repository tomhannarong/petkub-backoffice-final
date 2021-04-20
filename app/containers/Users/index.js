import React, { useContext, useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '@material-ui/core/Chip';
import MUIDataTable from 'mui-datatables';
import Loading from 'dan-components/Loading';
import { Helmet } from 'react-helmet';
import { PapperBlock } from 'dan-components';
import { useQuery } from '@apollo/client';
import { QUERY_USERS } from './../../apollo/queries';

const styles = theme => ({
    table: {
      '& > div': {
        overflow: 'auto'
      },
      '& table': {
        '& td': {
          wordBreak: 'keep-all'
        },
        [theme.breakpoints.down('md')]: {
          '& td': {
            height: 60,
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }
      }
    }
});

function Users(props) {
    const title = 'Dandelion Pro. Blank Page';
    const description = 'Dandelion Pro';

    const { loading, error, data } = useQuery(QUERY_USERS , {errorPolicy: 'all' , fetchPolicy: 'network-only'});
    const [dataUser, setdataUser] = useState([])
 
    useEffect(() => {
        if (data){
            for (let v of data.users) {
                const {fname, lname} = v.personalInformation
                let _arr = []
                _arr.push(`${fname?fname:'-'} ${lname?lname:'-'}`)
                _arr.push(v.email)
                _arr.push(v.profileImg ? v.profileImg : '-')
                _arr.push(Math.floor(Math.random() * 101))
                _arr.push(v.deletedAt?'non-active':'active')
                

                setdataUser( dataUser => [...dataUser, _arr]);
            
            }   
        }
    }, [data]);

    useEffect(() => {
        if(dataUser) console.log("arr : " , dataUser)
    }, [dataUser])


    // const columns = [
    //     {
    //       name: 'Name',
    //       options: {
    //         filter: true
    //       }
    //     },
    //     {
    //       name: 'Title',
    //       options: {
    //         filter: true,
    //       }
    //     },
    //     {
    //       name: 'KPI',
    //       options: {
    //         filter: false,
    //         customBodyRender: (value) => (
    //           <LinearProgress variant="determinate" color="secondary" value={value} />
    //         )
    //       }
    //     },
    //     {
    //       name: 'Status',
    //       options: {
    //         filter: true,
    //         customBodyRender: (value) => {
    //           if (value === 'active') {
    //             return (<Chip label="Active" color="secondary" />);
    //           }
    //           if (value === 'non-active') {
    //             return (<Chip label="Non Active" color="primary" />);
    //           }
    //           return (<Chip label="Unknown" />);
    //         }
    //       }
    //     },
    //     {
    //       name: 'Salary',
    //       options: {
    //         filter: true,
    //         customBodyRender: (value) => {
    //           const nf = new Intl.NumberFormat('en-US', {
    //             style: 'currency',
    //             currency: 'USD',
    //             minimumFractionDigits: 2,
    //             maximumFractionDigits: 2
    //           });
    
    //           return nf.format(value);
    //         }
    //       }
    //     },
    // ];

    const columns = [
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
            name: 'Profile Image',
            options: {
                filter: false,
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
            name: 'Status',
            options: {
            filter: true,
            customBodyRender: (value) => {
                if (value === 'active') {
                return (<Chip label="Active" color="secondary" />);
                }
                if (value === 'non-active') {
                return (<Chip label="Non Active" color="primary" />);
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
    
      const { classes } = props;
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
            <PapperBlock title="Users Table" icon="md-contact" desc="Display data for the users from users table.">
                <div className={classes.table}>
                    <MUIDataTable
                        title="Users Data"
                        data={dataUser}
                        columns={columns}
                        options={options}
                        
                    />
                </div>
            </PapperBlock>
        </>
    )
}


Users.propTypes = {
    classes: PropTypes.object.isRequired
};
  
  export default withStyles(styles)(Users);