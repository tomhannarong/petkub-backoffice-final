import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import MUIDataTable from 'mui-datatables';

// Import Components
import { Helmet } from 'react-helmet';
import { PapperBlock } from 'dan-components';


// Import Apollo
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_PEY_TYPES } from '../../apollo/queries';

const styles = (theme) => ({
  table: {
    '& > div': {
      overflow: 'auto',
    },
    '& table': {
      '& td': {
        wordBreak: 'keep-all',
      },
      [theme.breakpoints.down('md')]: {
        '& td': {
          height: 60,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
      },
    },
  },
});
/*
  It uses npm mui-datatables. It's easy to use, you just describe columns and data collection.
  Checkout full documentation here :
  https://github.com/gregnb/mui-datatables/blob/master/README.md
*/
function PetType(props) {
  const { loading, error, data } = useQuery(QUERY_PEY_TYPES, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  });
  const [dataPetType, setDataPetType] = useState([]);

  useEffect(() => {
    if (data) {
      for (const v of data.petTypes) {
        const _arr = [];
        _arr.push(v.name);
        _arr.push(!v.deletedAt);

        setDataPetType((dataPetType) => [...dataPetType, _arr]);
      }
    }
  }, [data]);

  const columns = [
    {
      name: 'Name',
      options: {
        filter: true,
      },
    },

    {
      name: 'Status',
      options: {
        filter: true,
        customBodyRender: (value) => {
          if (value === true) {
            return <Chip label="Active" color="secondary" />;
          }
          if (value === false) {
            return <Chip label="Non Active" color="primary" />;
          }
          return <Chip label="Unknown" />;
        },
      },
    },
    {
      name: 'Action',
      options: {
        filter: true,
        customBodyRender: (value) => 'nahee',
      },
    },
  ];

  const options = {
    filterType: 'dropdown',
    responsive: 'stacked',
    print: true,
    rowsPerPage: 10,
    page: 0,
  };

  const title = 'Petkub - pet type';
  const description = 'pet type management';
  const { classes } = props;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <PapperBlock
        title="Pet Type Table"
        noMargin
        icon="md-contact"
        desc="Display data for the pet type from pet type table."
      >
        <div className={classes.table}>
          <MUIDataTable
            title="Pet Type list"
            data={dataPetType}
            columns={columns}
            options={options}
          />
        </div>
      </PapperBlock>
    </>
  );
}

PetType.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PetType);
