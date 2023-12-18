import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { PersonAddAlt } from '@mui/icons-material';
import MapIcon from '@mui/icons-material/Map';
import InfoIcon from '@mui/icons-material/Info';

const onClickFunction = (link) => {
  window.location.href = link
}

export const mainListItems = (
  <React.Fragment>
    
      <ListItemButton component="a" href="/main" onClick={() => onClickFunction("/main")}>
        <ListItemIcon>
          <MapIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>

      <ListItemButton component="a" href="/register-user" onClick={() => onClickFunction("/register-user")}>
      <ListItemIcon>
        <PersonAddAlt />
      </ListItemIcon>
      <ListItemText primary="Register User" />
    </ListItemButton>

    <ListItemButton component="a" href="/about" onClick={() => onClickFunction("/about")}>
      <ListItemIcon>
        <InfoIcon />
      </ListItemIcon>
      <ListItemText primary="About" />
    </ListItemButton>
  
  </React.Fragment>
);
