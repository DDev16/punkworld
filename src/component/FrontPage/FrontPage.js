import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import '../../component/FrontPage/FrontPage.css';
import { getCurrentYear } from '../../component/utils/date.js';
import '../../Assets/fonts.css';
import {MyNFT} from '../../abi/MyNFT.js';
import Web3 from "web3";
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
  const [loadingNFT, setLoadingNFT] = useState(true);
  const [ownsNFT, setOwnsNFT] = useState(false);

  const checkNFTOwnership = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request user's account
        const accounts = await web3.eth.getAccounts();
        const myNFTInstance = new web3.eth.Contract(MyNFT, CONTRACT_ADDRESS);
        // You may need to adjust this depending on your NFT contract
        const balance = await myNFTInstance.methods.balanceOf(accounts[0]).call();
        
        // Convert balance to BigInt and then compare it with BigInt(0)
        setOwnsNFT(balance.toString() > '0');
      } catch (error) {
        console.error("Error checking NFT ownership: ", error);
      }
    } else {
      console.log("Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!");
    }
  
    setLoadingNFT(false);
  };

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    checkNFTOwnership();  // Call the function

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
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

<Link to={ownsNFT ? "/seussworld" : "#"}>
          <motion.button
            className="enter-button"
            whileHover={{ scale: 1.1, rotate: [0, 360] }}
            whileTap={{ scale: 0.9 }}
            aria-label="Enter SeussWorld"
            title="You need an NFT to enter the world"
            style={{ fontFamily: 'SeussFont', fontSize: '20px' }}
            disabled={!ownsNFT || loadingNFT}
          >
            {loadingNFT ? 'Checking NFT...' : ownsNFT ? 'Enter SeussWorld' : 'You need an NFT to enter'}
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
