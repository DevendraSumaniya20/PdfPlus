import {useEffect, useState} from 'react';
import {useColorScheme, Appearance} from 'react-native';

const CustomTheme = () => {
  const colorScheme = useColorScheme();
  const [currentColorScheme, setCurrentColorScheme] = useState(colorScheme);

  const darkmodeColor = currentColorScheme === 'dark' ? '#fff' : '#000';
  const darkBorderColor = currentColorScheme === 'dark' ? '#fff' : '#000';
  const darkBackgroundColor = currentColorScheme === 'dark' ? '#000' : '#fff';
  const disabledBackgroundColor =
    currentColorScheme === 'dark' ? '#4a4a4a' : '#d3d3d3';
  const disabledTextColor =
    currentColorScheme === 'dark' ? '#a0a0a0' : '#808080';
  const disabledBorderColor =
    currentColorScheme === 'dark' ? '#2c2c2c' : '#c0c0c0';

  const handleColorSchemeChange = newColorScheme => {
    setCurrentColorScheme(newColorScheme);
  };

  useEffect(() => {
    const initialColorScheme = Appearance.getColorScheme();
    handleColorSchemeChange(initialColorScheme);

    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      handleColorSchemeChange(colorScheme);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    darkmodeColor,
    darkBorderColor,
    darkBackgroundColor,
    disabledBackgroundColor,
    disabledTextColor,
    disabledBorderColor,
  };
};

export default CustomTheme;
