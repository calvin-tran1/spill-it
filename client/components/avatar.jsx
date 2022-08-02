import React, { Fragment } from 'react';
import classes from '../lib/avatar.module.css';

const Avatar = ({ imageUrl, name, width, height }) => {
  return (
    <>
      <div className="avatar-wrapper">
        {imageUrl && <img className={classes.avatarimage} alt="avatar" src={imageUrl} width={width} height={height} />}
        {imageUrl === undefined && name !== '' &&
          <div className={classes.avatartext}>
            {name.substring(0, 2)}
          </div>
        }
      </div>
    </>
  );
};

export default Avatar;
