import React, { useContext, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import { withStyles } from '@material-ui/core/styles';
import { LoginFormV2 } from 'dan-components';
import styles from 'dan-components/Forms/user-jss';
import { useMutation, useQuery } from '@apollo/client';
import { SIGN_IN } from '../../../apollo/mutations';
import { ME } from '../../../apollo/queries';
import { setCookie, getCookie } from '../../../utils/cookie';
import { AuthContext } from '../../../context/AuthContextProvider';
import { isSuperAdmin, isAdmin } from '../../../helpers/authHelpers';


function LoginV2(props) {
  const { loggedInUser, setAuthUser } = useContext(AuthContext);
  const [cookieLocal, setCookieLocal] = useState('');

  const [signin] = useMutation(SIGN_IN);
  const meQuery = useQuery(ME, { fetchPolicy: 'network-only', errorPolicy: 'all', });


  useEffect(() => {
    try {
      // If user in not authenticated, push to home page
      if (!loggedInUser) {
        // window.location.href = '/login';
      } else {
        // Push user to their dashboard
        window.location.href = '/app';
      }
    } catch (error) {
      throw error;
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (!loggedInUser) {
      if (cookieLocal) {
        const me = meQuery.refetch().then((response) => response.data.me);

        me.then((result) => {
          const isAdminUser = isAdmin(result) || isSuperAdmin(result);

          if (isAdminUser) {
            // Push user to their dashboard
            setAuthUser(result);
            window.location.href = '/app';
          }
        });
      }
    }
  }, [cookieLocal]);

  const submitForm = async (values) => {
    try {
      const json = JSON.stringify(values);
      const { email, password } = JSON.parse(json);

      const response = await signin({ variables: { email, password } });

      if (response.data.signin) {
        // Get Token from response backend
        const json = JSON.stringify(response.data.signin);
        const {
          userId, accessToken, refreshToken, expiresIn
        } = JSON.parse(json);

        // Set Cookie in browser
        setCookie('accessToken', accessToken);
        setCookie('refreshToken', refreshToken);
        setCookieLocal(accessToken);
      }
    } catch (error) {
      setAuthUser(null);
      throw error;
    }
    // window.location.href = '/app';
  };

  const title = 'Petkub - Login';
  const description = brand.desc;
  const { classes } = props;
  return (
    <div className={classes.rootFull}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <div className={classes.containerSide}>
        <Hidden smDown>
          <div className={classes.opening}>
            <Typography variant="h3" component="h1" className={classes.opening} gutterBottom>
              Welcome to&nbsp;
              { 'Petkub Management' }
            </Typography>
            <Typography variant="h6" component="p" className={classes.subpening}>Please sign in to continue</Typography>
          </div>
        </Hidden>
        <div className={classes.sideFormWrap}>
          <LoginFormV2 onSubmit={(values) => submitForm(values)} />
        </div>
      </div>
    </div>
  );
}

LoginV2.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginV2);
