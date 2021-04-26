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
import { QUERY_PEY_BREEDS } from '../../apollo/queries';

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
  const { loading, error, data } = useQuery(QUERY_PEY_BREEDS, {
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  });
  const [dataPetBreed, setDataPetType] = useState([]);

  useEffect(() => {
    if (data) {
      for (const v of data.petBreeds) {
        const { name } = v.petType;
        const _arr = [];
        _arr.push(v.name);
        _arr.push(name);
        _arr.push(!v.deletedAt);

        setDataPetType((dataPetBreed) => [...dataPetBreed, _arr]);
      }
    }
  }, [data]);

  const columns = [
    {
      name: 'Breed',
      options: {
        filter: true,
      },
    },

    {
      name: 'Type',
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

  const title = 'Petkub - pet breed';
  const description = 'pet breed management';
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
        title="Pet Breed Table"
        noMargin
        icon="md-contact"
        desc="Display data for the pet breed from pet breed table."
      >
        <div className={classes.table}>
          <MUIDataTable
            title="Pet Breed list"
            data={dataPetBreed}
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
