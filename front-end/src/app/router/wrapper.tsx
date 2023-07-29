import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ROUTES from './config';

type WrapperProps = {
    children: React.ReactNode
};

type MenuItemProps = {
    to: string
    title: string
    isActive: boolean
};

const MenuItemStyles = {
    paddingX: 2,
    paddingY: 2,
    marginX: 2,
    marginY: 0.5,
    borderRadius: 2,
    color: '#000000',
    fontSize: 16,
};

const MenuItem: React.FC<MenuItemProps> = React.memo((props) => {
    const { to, title, isActive } = props;

    if (isActive) {
        return (
            <Box sx={{backgroundColor: '#4f4f4f', fontWeight: 700, ...MenuItemStyles}}>
                <Typography color="#ffffff" fontWeight={700}>
                    {title}
                </Typography>
            </Box>
        );
    }

    return (
        <Link to={to} style={{textDecoration: 'none'}}>
            <Box sx={{...MenuItemStyles, ":hover": {backgroundColor: '#d0d0d0'}}}>
                <Typography>
                    {title}
                </Typography>
            </Box>
        </Link>
    );
});

const Menu: React.FC = () => {
    const location = useLocation();

    return (
        <>
            {ROUTES.filter((el) => el.path !== '*').map((el) => (
                <MenuItem
                    to={el.path}
                    key={el.path}
                    title={el.title ?? ''}
                    isActive={location.pathname === el.path}
                />
            ))}
        </>
    );
};

const Wrapper: React.FC<WrapperProps> = (props) => {
    const { children } = props;

    const location = useLocation();

    const pageTitle = ROUTES.find((el) => el.path === location.pathname)?.title;

    return (
        <Container maxWidth={false} disableGutters sx={{height: '100vh', display: 'flex'}}>
            <Box width={360} sx={{backgroundColor: '#efefef'}}>
                <Typography
                    variant="h5"
                    fontWeight={700}
                    textAlign="center"
                    marginTop={2}
                    marginBottom={3}
                >
                    Принтер котусика
                </Typography>
                <Menu />
            </Box>
            <Container>
                <Typography variant='h3' textAlign="center" marginY={4}>{pageTitle}</Typography>
                {children}
            </Container>
        </Container>
    );
};

export default Wrapper;
