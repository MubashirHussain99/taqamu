// import * as React from "react";
// import { Dimensions } from "react-native";

// const MOBILE_BREAKPOINT = 768;

// export function useIsMobile() {
//   const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

//   React.useEffect(() => {
//     const onChange = () => {
//       setIsMobile(Dimensions.get('window').width < MOBILE_BREAKPOINT);
//     };

//     // Initially check the screen width
//     onChange();

//     // Add event listener to listen for screen width changes
//     const subscription = Dimensions.addEventListener('change', onChange);

//     // Cleanup the listener on component unmount
//     return () => subscription?.remove();
//   }, []);

//   return !!isMobile;
// }


import React from 'react';
import { Dimensions } from 'react-native';

const MOBILE_BREAKPOINT = 768; // Adjust as needed

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined);

  React.useEffect(() => {
    const onChange = () => {
      setIsMobile(Dimensions.get('window').width < MOBILE_BREAKPOINT);
    };

    onChange(); // Initial check

    const subscription = Dimensions.addEventListener('change', onChange);

    return () => subscription?.remove?.(); // Safe cleanup for older RN versions
  }, []);

  return !!isMobile;
}
