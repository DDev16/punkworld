import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Navigation = ({ links }) => (
    <nav>
        <ul className="nav-links">
            {links.map((link, index) => (
                <li key={index}>
                    <Link to={link.path}>{link.name}</Link>
                </li>
            ))}
        </ul>
    </nav>
);

Navigation.propTypes = {
    links: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default Navigation;
