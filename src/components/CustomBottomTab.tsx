import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {styled} from 'nativewind';

const refrigeOff = require('../assets/bottomTap/refrige_off.png');
const refrigeOn = require('../assets/bottomTap/refrige_on.png');
const barcodeOff = require('../assets/bottomTap/barcode_off.png');
const barcodeOn = require('../assets/bottomTap/barcode_on.png');
const recipeOff = require('../assets/bottomTap/recipe_off.png');
const recipeOn = require('../assets/bottomTap/recipe_on.png');
const badgeOff = require('../assets/bottomTap/badge_off.png');
const badgeOn = require('../assets/bottomTap/badge_on.png');

const BottomTab = styled(View);
const TouchArea = styled(TouchableOpacity);

function CustomBottomTab({state, descriptors, navigation}) {
  return (
    <BottomTab className={`flex flex-row`}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const iconFlag = (bool: boolean) => {
          switch (label) {
            case '냉장고':
              return bool ? refrigeOn : refrigeOff;
            case '스캔':
              return bool ? barcodeOn : barcodeOff;
            case '레시피 추천':
              return bool ? recipeOn : recipeOff;
            default:
              return bool ? badgeOn : badgeOff;
          }
        };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchArea
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            className={`flex flex-1 w-full h-20 px-4 bg-white border-t border-zinc-100 justify-center items-center gap-2 inline-flex`}>
            <Image source={iconFlag(isFocused)} />
            <Text
              className={`text-xs font-bold`}
              style={{color: isFocused ? '#007CFF' : '#111111'}}>
              {label}
            </Text>
          </TouchArea>
        );
      })}
    </BottomTab>
  );
}

export default CustomBottomTab;
