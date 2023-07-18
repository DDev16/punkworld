import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import '../../component/FrontPage/FrontPage.css';
import { getCurrentYear } from '../../component/utils/date.js';
import '../../Assets/fonts.css';
import Web3 from 'web3';
import {MyNFT} from '../../abi/MyNFT.js';

const Navigation = lazy(() => import('../../component/NAV/NavBar.js'));

const transitionOptions = { delay: 0.2, type: 'spring', stiffness: 120 };
const CONTRACT_ADDRESS = '0xEe2d1f6D5C8d71e8c97CAA4A80fF9eD87dbB9C34';

const AnimatedText = ({ initial, animate, transition, text, style }) => (
  <motion.p initial={initial} animate={animate} transition={transition} style={style}>
    {text}
  </motion.p>
);

const FrontPage = () => {
  const year = useMemo(() => getCurrentYear(), []);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [ownsNFT, setOwnsNFT] = useState(false);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    async function checkNFTOwnership() {
      // Ensure window is defined (i.e., code is running on client)
  if (typeof window !== 'undefined') {
    const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          const accounts = await web3.eth.getAccounts();
          const currentAccount = accounts[0];

          const nftContract = new web3.eth.Contract(
            MyNFT,
            CONTRACT_ADDRESS
          );

          const balance = await nftContract.methods
            .balanceOf(currentAccount)
            .call();

          if (balance > 0) {
            setOwnsNFT(true);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    checkNFTOwnership();
  }, []);

  const fontSize = useMemo(() => {
    if (windowWidth < 480) {
      return '80px';
    } else if (windowWidth < 768) {
      return '80px';
    } else {
      return '100px';
    }
  }, [windowWidth]);

  return (
    <div className="front-page-container">
      <motion.header
        className="header"
        initial={{ y: -250, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          fontFamily: 'SeussFont',
          color: '#F39C12',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
      >
        <h1 className="logo" aria-label="SeussWorld Logo">
          PunkWorld
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation
            links={[
              { name: 'About', path: '/about' },
              { name: 'Contact', path: '/contact' },
            ]}
          />
        </Suspense>
      </motion.header>

      <motion.main
        className="main-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        role="main"
      >
        <div
          style={{
            marginTop: '100px',
            width: '400px',
            height: '400px',
            background: `url(${require('../../component/FrontPage/punk1.png')}) center/cover`,
            borderRadius: '50%',
            margin: '0 auto',
          }}
        />

        <AnimatedText
          className="Title"
          initial={{ y: -250, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={transitionOptions}
          style={{
            fontFamily: 'SeussFont',
            color: '#F39C12',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            background: 'rgba(255, 255, 255, 0.3)',
            padding: '10px',
            fontSize: fontSize,
            borderRadius: '5px',
            fontWeight: 'bold',
          }}
          text="Welcome to our PunkWorld!"
        />
        <AnimatedText
          initial={{ scale: 0.7, y: -250, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={transitionOptions}
          style={{
            fontFamily: 'SeussFont',
            color: '#F39C12',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            background: 'rgba(255, 255, 255, 0.3)',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '40px',
            fontWeight: 'bold',
          }}
          text="Experience an immersive 3D world inspired by the whimsical charm of Dr. Seuss and the power of blockchain Punks. Navigate through our fantastic landscapes, find Easter eggs hidden around,  interact with our unique assets, and step into a world beyond the ordinary."
        />
{!ownsNFT && (
  <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
    You do not own an NFT! Please purchase one to enter SeussWorld.
  </p>
)}

        <Link to={ownsNFT ? "/seussworld" : "/"}>
          <motion.button
            disabled={!ownsNFT}
            className="enter-button"
            whileHover={{ scale: 1.1, rotate: [0, 360] }}
            whileTap={{ scale: 0.9 }}
            aria-label="Enter SeussWorld"
            title="You need an NFT to enter the world"
            style={{ fontFamily: 'SeussFont', fontSize: '20px' }}
          >
            Enter SeussWorld
          </motion.button>
        </Link>
      </motion.main>

      <motion.footer
        className="footer"
        initial={{ y: 250, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.5 }}style={{
          fontFamily: 'SeussFont',
          color: '#F39C12',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          padding: '10px',
          fontSize: '24px',
          borderRadius: '5px',
          fontWeight: 'bold',
        }}
      >
        <h4 aria-label="Footer Note">
          © {year} PunkWorld - All rights reserved
        </h4>
      </motion.footer>
    </div>
  );
};

AnimatedText.propTypes = {
  initial: PropTypes.object,
  animate: PropTypes.object,
  transition: PropTypes.object,
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
};



AnimatedText.defaultProps = {
  initial: { y: -250, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: transitionOptions,
  text: '',
};

FrontPage.propTypes = {
  history: PropTypes.object,
};

export default FrontPage;
