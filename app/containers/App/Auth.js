import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Outer from '../Templates/Outer';
import {
  LoginV2,
  ResetPassword, LockScreen, ComingSoon,
  Maintenance,
  NotFound,
} from '../pageListAsync';

function Auth() {
  return (
    <Outer>
      <Switch>
        <Route path="/login" component={LoginV2} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/lock-screen" component={LockScreen} />
        <Route path="/maintenance" component={Maintenance} />
        <Route path="/coming-soon" component={ComingSoon} />
        <Route component={NotFound} />
      </Switch>
    </Outer>
  );
}

export default Auth;
