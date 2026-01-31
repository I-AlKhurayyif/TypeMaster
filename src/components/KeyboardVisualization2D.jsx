import React, { useState, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';

/**
 * 2D Keyboard and Hands Visualization Component
 * Uses anatomically accurate hand SVGs with separate finger paths for individual coloring
 * Hands positioned BELOW keyboard to match natural typing position
 */

// Finger identifiers
const Finger = {
  L_PINKY: 'L_PINKY',
  L_RING: 'L_RING',
  L_MIDDLE: 'L_MIDDLE',
  L_INDEX: 'L_INDEX',
  L_THUMB: 'L_THUMB',
  R_THUMB: 'R_THUMB',
  R_INDEX: 'R_INDEX',
  R_MIDDLE: 'R_MIDDLE',
  R_RING: 'R_RING',
  R_PINKY: 'R_PINKY',
};

// Finger colors for visual distinction
const fingerColors = {
  [Finger.L_PINKY]: { base: '#ec4899', light: '#fce7f3', dark: '#be185d', name: 'Left Pinky' },
  [Finger.L_RING]: { base: '#f97316', light: '#ffedd5', dark: '#c2410c', name: 'Left Ring' },
  [Finger.L_MIDDLE]: { base: '#eab308', light: '#fef9c3', dark: '#a16207', name: 'Left Middle' },
  [Finger.L_INDEX]: { base: '#22c55e', light: '#dcfce7', dark: '#15803d', name: 'Left Index' },
  [Finger.L_THUMB]: { base: '#6366f1', light: '#e0e7ff', dark: '#4338ca', name: 'Left Thumb' },
  [Finger.R_THUMB]: { base: '#6366f1', light: '#e0e7ff', dark: '#4338ca', name: 'Right Thumb' },
  [Finger.R_INDEX]: { base: '#22c55e', light: '#dcfce7', dark: '#15803d', name: 'Right Index' },
  [Finger.R_MIDDLE]: { base: '#eab308', light: '#fef9c3', dark: '#a16207', name: 'Right Middle' },
  [Finger.R_RING]: { base: '#f97316', light: '#ffedd5', dark: '#c2410c', name: 'Right Ring' },
  [Finger.R_PINKY]: { base: '#ec4899', light: '#fce7f3', dark: '#be185d', name: 'Right Pinky' },
};

// Default skin color
const SKIN_COLOR = '#DDAF73';
const SKIN_COLOR_DARK = '#C49A60';

// Keyboard layout with finger assignments
const keyboardLayout = [
  [
    { key: '`', shift: '~', width: 1, finger: Finger.L_PINKY },
    { key: '1', shift: '!', width: 1, finger: Finger.L_PINKY },
    { key: '2', shift: '@', width: 1, finger: Finger.L_RING },
    { key: '3', shift: '#', width: 1, finger: Finger.L_MIDDLE },
    { key: '4', shift: '$', width: 1, finger: Finger.L_INDEX },
    { key: '5', shift: '%', width: 1, finger: Finger.L_INDEX },
    { key: '6', shift: '^', width: 1, finger: Finger.R_INDEX },
    { key: '7', shift: '&', width: 1, finger: Finger.R_INDEX },
    { key: '8', shift: '*', width: 1, finger: Finger.R_MIDDLE },
    { key: '9', shift: '(', width: 1, finger: Finger.R_RING },
    { key: '0', shift: ')', width: 1, finger: Finger.R_PINKY },
    { key: '-', shift: '_', width: 1, finger: Finger.R_PINKY },
    { key: '=', shift: '+', width: 1, finger: Finger.R_PINKY },
    { key: '⌫', width: 1.8, finger: Finger.R_PINKY },
  ],
  [
    { key: '⇥', width: 1.4, finger: Finger.L_PINKY },
    { key: 'q', shift: 'Q', width: 1, finger: Finger.L_PINKY },
    { key: 'w', shift: 'W', width: 1, finger: Finger.L_RING },
    { key: 'e', shift: 'E', width: 1, finger: Finger.L_MIDDLE },
    { key: 'r', shift: 'R', width: 1, finger: Finger.L_INDEX },
    { key: 't', shift: 'T', width: 1, finger: Finger.L_INDEX },
    { key: 'y', shift: 'Y', width: 1, finger: Finger.R_INDEX },
    { key: 'u', shift: 'U', width: 1, finger: Finger.R_INDEX },
    { key: 'i', shift: 'I', width: 1, finger: Finger.R_MIDDLE },
    { key: 'o', shift: 'O', width: 1, finger: Finger.R_RING },
    { key: 'p', shift: 'P', width: 1, finger: Finger.R_PINKY },
    { key: '[', shift: '{', width: 1, finger: Finger.R_PINKY },
    { key: ']', shift: '}', width: 1, finger: Finger.R_PINKY },
    { key: '\\', shift: '|', width: 1.4, finger: Finger.R_PINKY },
  ],
  [
    { key: '⇪', width: 1.7, finger: Finger.L_PINKY },
    { key: 'a', shift: 'A', width: 1, finger: Finger.L_PINKY, isHome: true },
    { key: 's', shift: 'S', width: 1, finger: Finger.L_RING, isHome: true },
    { key: 'd', shift: 'D', width: 1, finger: Finger.L_MIDDLE, isHome: true },
    { key: 'f', shift: 'F', width: 1, finger: Finger.L_INDEX, isHome: true },
    { key: 'g', shift: 'G', width: 1, finger: Finger.L_INDEX },
    { key: 'h', shift: 'H', width: 1, finger: Finger.R_INDEX },
    { key: 'j', shift: 'J', width: 1, finger: Finger.R_INDEX, isHome: true },
    { key: 'k', shift: 'K', width: 1, finger: Finger.R_MIDDLE, isHome: true },
    { key: 'l', shift: 'L', width: 1, finger: Finger.R_RING, isHome: true },
    { key: ';', shift: ':', width: 1, finger: Finger.R_PINKY, isHome: true },
    { key: "'", shift: '"', width: 1, finger: Finger.R_PINKY },
    { key: '↵', width: 2.1, finger: Finger.R_PINKY },
  ],
  [
    { key: '⇧', id: 'LShift', width: 2.1, finger: Finger.L_PINKY },
    { key: 'z', shift: 'Z', width: 1, finger: Finger.L_PINKY },
    { key: 'x', shift: 'X', width: 1, finger: Finger.L_RING },
    { key: 'c', shift: 'C', width: 1, finger: Finger.L_MIDDLE },
    { key: 'v', shift: 'V', width: 1, finger: Finger.L_INDEX },
    { key: 'b', shift: 'B', width: 1, finger: Finger.L_INDEX },
    { key: 'n', shift: 'N', width: 1, finger: Finger.R_INDEX },
    { key: 'm', shift: 'M', width: 1, finger: Finger.R_INDEX },
    { key: ',', shift: '<', width: 1, finger: Finger.R_MIDDLE },
    { key: '.', shift: '>', width: 1, finger: Finger.R_RING },
    { key: '/', shift: '?', width: 1, finger: Finger.R_PINKY },
    { key: '⇧', id: 'RShift', width: 2.7, finger: Finger.R_PINKY },
  ],
  [
    { key: 'Ctrl', width: 1.3, finger: Finger.L_PINKY },
    { key: '⌘', width: 1.1, finger: Finger.L_THUMB },
    { key: 'Alt', width: 1.1, finger: Finger.L_THUMB },
    { key: ' ', display: '', width: 6.4, finger: Finger.R_THUMB },
    { key: 'Alt', id: 'RAlt', width: 1.1, finger: Finger.R_THUMB },
    { key: '⌘', id: 'RWin', width: 1.1, finger: Finger.R_THUMB },
    { key: '☰', width: 1.1, finger: Finger.R_PINKY },
    { key: 'Ctrl', id: 'RCtrl', width: 1.3, finger: Finger.R_PINKY },
  ],
];

// Build character to key mapping
const charToKeyInfo = new Map();
keyboardLayout.forEach((row, rowIndex) => {
  row.forEach((keyData) => {
    if (keyData.key.length === 1 && !['⇥', '⇪', '⇧', '⌫', '↵', '⌘', '☰'].includes(keyData.key)) {
      charToKeyInfo.set(keyData.key, { ...keyData, row: rowIndex });
      if (keyData.shift) {
        charToKeyInfo.set(keyData.shift, { ...keyData, row: rowIndex, needsShift: true });
      }
    }
    if (keyData.key === ' ') {
      charToKeyInfo.set(' ', { ...keyData, row: rowIndex });
    }
  });
});

/**
 * Left Hand SVG Component with separate finger paths
 */
const LeftHandSVG = ({ hintedFinger, pressedFinger, showFingerZones }) => {
  const getFingerColor = (fingerId) => {
    const isPressed = pressedFinger === fingerId;
    const isHinted = hintedFinger === fingerId;
    const color = fingerColors[fingerId];

    if (isPressed) return color.base;
    if (isHinted) return color.light;
    if (showFingerZones) return color.light;
    return SKIN_COLOR;
  };

  const getFingerStroke = (fingerId) => {
    const isPressed = pressedFinger === fingerId;
    const isHinted = hintedFinger === fingerId;
    const color = fingerColors[fingerId];

    if (isPressed) return { stroke: color.dark, strokeWidth: 4 };
    if (isHinted) return { stroke: color.base, strokeWidth: 3 };
    return { stroke: '#B8935C', strokeWidth: 1.5 };
  };

  const getTransform = (fingerId) => {
    if (pressedFinger === fingerId) return 'translate(0, -8)';
    if (hintedFinger === fingerId) return 'translate(0, -4)';
    return '';
  };

  return (
    <svg viewBox="0 0 1280 853" className="w-full h-full drop-shadow-lg">
      {/* Palm and main hand (Pinky side - includes palm) */}
      <path
        d="M357.13,263.7c9.3,14.2,13.2,21.2,17.8,32.6c3.7,9.1,7,15.1,19.1,34.7c10.8,17.7,22.8,44.6,24.4,55 c0.3,1.9,1.4,7.8,2.5,13c2.1,9.5,5,34.2,7.1,60.5c1.5,18.3,5.5,45.8,8.1,56.5c1.2,4.7,6.8,20,12.6,34s11.4,29.3,12.5,34 c1.1,4.7,4.2,17.5,6.9,28.5c6.9,28.8,7.9,35.5,7.9,54.7c0,16.8-1,27.3-5.5,55.8c-2.1,13.2-3.7,25.1-7.1,53.2l-0.6,4.8h188.5 l-0.6-5.2c-1.5-11.9-2.9-68.1-2.4-93.3c0.4-24.3,0.7-28.2,3.1-39c5.8-26.5,9.3-32.7,27.1-48c3.9-3.3,12.7-12.1,19.6-19.5 c11-11.7,38.7-38.9,55.8-54.6c10.7-9.8,15.2-17,25.1-39.9c2.8-6.6,6.3-14,7.7-16.5c4.6-8,16-23.3,22.7-30.4l-58.4-38.6 c-7.8,10.3-26.8,30-28.9,30c-1.9,0-4-4.3-7.9-16.5c-7.3-22.7-8.9-38.1-5.2-52.3c1-4.3,3.1-14.8,4.5-23.5c2.2-13,4.1-20.2,11.4-42 c4.9-14.4,10.3-30,12.1-34.7c7.1-18.7,12.4-37.5,13.5-47.5c1-8.5,6.9-35.5,10.1-45.5l-53.1-25.5c-2.9,14-6.1,23.1-14.8,42 c-3,6.6-11.6,27.5-19.2,46.5c-13.8,34.8-19.3,46.4-24.8,52.7c-2.9,3.2-11.3,8.3-13.8,8.3c-2.4,0,0.2-17,11.5-74 c3.3-16.7,4.8-27,5.6-39.5c1.5-23.2,3.6-41.5,6.6-57l-56.4-6c-1.6,12.7-3.8,23.6-8.7,43c-8.1,31.9-11.1,46.1-12.5,60.2 c-2.1,20.4-6,50.8-7.4,56.6c-1.8,7.5-5.9,13.2-12.1,16.8c-2.7,1.6-5.4,2.9-5.8,2.9c-0.4,0-1.7-2.1-2.9-4.6 c-1.5-3.6-2.3-8.9-3.4-23.3c-1.6-22.1-2.4-27.2-7.6-50.1c-9.7-43-9.8-44-10.3-83.9l-51.8,20.9c0.9,6.7,1.8,24.3,2.3,48.5 c0.6,32.4,1.1,40.7,3.3,56.6c3.8,26.8,4.3,40.6,2,49.4c-1.8,7-1.8,7-7.3,9.7c-4.6,2.3-6.6,2.7-12.1,2.5c-8.3-0.3-10.5-2-27.7-21.1 c-25-27.7-31.7-37.1-43.2-61.1L357.13,263.7z"
        fill={getFingerColor(Finger.L_PINKY)}
        {...getFingerStroke(Finger.L_PINKY)}
        className="transition-all duration-150"
      />

      {/* Thumb */}
      <g transform={getTransform(Finger.L_THUMB)}>
        <path
          d="M751.03,396l58.4,38.6c3.6-3.9,6.8-7.7,7.1-8.5c0.3-0.9,1.8-2.3,3.4-3.1c1.6-0.8,6.2-5.1,10.1-9.5 c18.5-20.3,26.2-27.5,37.5-35c12.2-8,13.5-9.8,13.5-18c0-5.1-4.3-12.3-9.3-15.4c-1.9-1.1-6.5-2.9-10.2-3.8c-5.9-1.4-8-1.5-17.4-0.4 c-25.5,3.1-42.4,8.5-56.9,18.2C779.23,364.5,760.23,383.9,751.03,396z"
          fill={getFingerColor(Finger.L_THUMB)}
          {...getFingerStroke(Finger.L_THUMB)}
          className="transition-all duration-150"
        />
      </g>

      {/* Index Finger */}
      <g transform={getTransform(Finger.L_INDEX)}>
        <path
          d="M707.53,138.5l53.1,25.5c7.2-23,11.4-49.6,9.4-60.8c-1.7-10.2-7.4-18.2-15.9-22.7c-8.1-4.1-19-2.6-25.2,3.6 C721.53,91.5,712.63,114.1,707.53,138.5z"
          fill={getFingerColor(Finger.L_INDEX)}
          {...getFingerStroke(Finger.L_INDEX)}
          className="transition-all duration-150"
        />
      </g>

      {/* Middle Finger */}
      <g transform={getTransform(Finger.L_MIDDLE)}>
        <path
          d="M602.23,111.5l56.4,6c3.1-16.2,6.4-40.2,7.1-51.7c0.7-11-1.3-18-7-24.4c-3.9-4.4-7.3-6.8-13.2-9.1 c-5.2-2-13.5-1.5-19,1.1c-10.4,4.9-13.3,11.1-18.4,39.8C605.93,84.9,603.33,102.1,602.23,111.5z"
          fill={getFingerColor(Finger.L_MIDDLE)}
          {...getFingerStroke(Finger.L_MIDDLE)}
          className="transition-all duration-150"
        />
      </g>

      {/* Ring Finger */}
      <g transform={getTransform(Finger.L_RING)}>
        <path
          d="M479.73,150l51.8-20.9c-0.2-18.8-0.9-35.8-1.5-38.8c-1.5-6.9-6-12.8-13-16.7c-4.7-2.7-6.5-3.1-12.5-3.1 c-6,0.1-7.9,0.5-12.5,3.1c-6.3,3.5-11.4,9.6-13.2,15.7C477.13,95,477.63,135.8,479.73,150z"
          fill={getFingerColor(Finger.L_RING)}
          {...getFingerStroke(Finger.L_RING)}
          className="transition-all duration-150"
        />
      </g>

      {/* Pinky Finger Tip */}
      <g transform={getTransform(Finger.L_PINKY)}>
        <path
          d="M341.93,234.9c5.4,13.5,6.8,16.1,15.2,28.8l39.9-29.2c-8.9-18.6-17.7-32.2-25.6-39.4c-6.4-5.8-10.7-7.5-18-6.9 c-7.2,0.6-12.4,4.2-15.8,10.9C333.23,208,334.13,215.4,341.93,234.9z"
          fill={getFingerColor(Finger.L_PINKY)}
          {...getFingerStroke(Finger.L_PINKY)}
          className="transition-all duration-150"
        />
      </g>
    </svg>
  );
};

/**
 * Right Hand SVG Component with separate finger paths
 */
const RightHandSVG = ({ hintedFinger, pressedFinger, showFingerZones }) => {
  const getFingerColor = (fingerId) => {
    const isPressed = pressedFinger === fingerId;
    const isHinted = hintedFinger === fingerId;
    const color = fingerColors[fingerId];

    if (isPressed) return color.base;
    if (isHinted) return color.light;
    if (showFingerZones) return color.light;
    return SKIN_COLOR;
  };

  const getFingerStroke = (fingerId) => {
    const isPressed = pressedFinger === fingerId;
    const isHinted = hintedFinger === fingerId;
    const color = fingerColors[fingerId];

    if (isPressed) return { stroke: color.dark, strokeWidth: 4 };
    if (isHinted) return { stroke: color.base, strokeWidth: 3 };
    return { stroke: '#B8935C', strokeWidth: 1.5 };
  };

  const getTransform = (fingerId) => {
    if (pressedFinger === fingerId) return 'translate(0, -8)';
    if (hintedFinger === fingerId) return 'translate(0, -4)';
    return '';
  };

  return (
    <svg viewBox="0 0 1280 853" className="w-full h-full drop-shadow-lg">
      {/* Palm and main hand (Pinky side - includes palm) */}
      <path
        d="M858.9,263.7c-9.3,14.2-13.2,21.2-17.8,32.6c-3.7,9.1-7,15.1-19.1,34.7c-10.8,17.7-22.8,44.6-24.4,55 c-0.3,1.9-1.4,7.8-2.5,13c-2.1,9.5-5,34.2-7.1,60.5c-1.5,18.3-5.5,45.8-8.1,56.5c-1.2,4.7-6.8,20-12.6,34s-11.4,29.3-12.5,34 c-1.1,4.7-4.2,17.5-6.9,28.5c-6.9,28.8-7.9,35.5-7.9,54.7c0,16.8,1,27.3,5.5,55.8c2.1,13.2,3.7,25.1,7.1,53.2l0.6,4.8H564.7l0.6-5.2 c1.5-11.9,2.9-68.1,2.4-93.3c-0.4-24.3-0.7-28.2-3.1-39c-5.8-26.5-9.3-32.7-27.1-48c-3.9-3.3-12.7-12.1-19.6-19.5 c-11-11.7-38.7-38.9-55.8-54.6c-10.7-9.8-15.2-17-25.1-39.9c-2.8-6.6-6.3-14-7.7-16.5c-4.6-8-16-23.3-22.7-30.4L465,396 c7.8,10.3,26.8,30,28.9,30c1.9,0,4-4.3,7.9-16.5c7.3-22.7,8.9-38.1,5.2-52.3c-1-4.3-3.1-14.8-4.5-23.5c-2.2-13-4.1-20.2-11.4-42 c-4.9-14.4-10.3-30-12.1-34.7c-7.1-18.7-12.4-37.5-13.5-47.5c-1-8.5-6.9-35.5-10.1-45.5l53.1-25.5c2.9,14,6.1,23.1,14.8,42 c3,6.6,11.6,27.5,19.2,46.5c13.8,34.8,19.3,46.4,24.8,52.7c2.9,3.2,11.3,8.3,13.8,8.3c2.4,0-0.2-17-11.5-74 c-3.3-16.7-4.8-27-5.6-39.5c-1.5-23.2-3.6-41.5-6.6-57l56.4-6c1.6,12.7,3.8,23.6,8.7,43c8.1,31.9,11.1,46.1,12.5,60.2 c2.1,20.4,6,50.8,7.4,56.6c1.8,7.5,5.9,13.2,12.1,16.8c2.7,1.6,5.4,2.9,5.8,2.9c0.4,0,1.7-2.1,2.9-4.6c1.5-3.6,2.3-8.9,3.4-23.3 c1.6-22.1,2.4-27.2,7.6-50.1c9.7-43,9.8-44,10.3-83.9l51.8,20.9c-0.9,6.7-1.8,24.3-2.3,48.5c-0.6,32.4-1.1,40.7-3.3,56.6 c-3.8,26.8-4.3,40.6-2,49.4c1.8,7,1.8,7,7.3,9.7c4.6,2.3,6.6,2.7,12.1,2.5c8.3-0.3,10.5-2,27.7-21.1c25-27.7,31.7-37.1,43.2-61.1 L858.9,263.7z"
        fill={getFingerColor(Finger.R_PINKY)}
        {...getFingerStroke(Finger.R_PINKY)}
        className="transition-all duration-150"
      />

      {/* Thumb */}
      <g transform={getTransform(Finger.R_THUMB)}>
        <path
          d="M465,396l-58.4,38.6c-3.6-3.9-6.8-7.7-7.1-8.5c-0.3-0.9-1.8-2.3-3.4-3.1c-1.6-0.8-6.2-5.1-10.1-9.5 c-18.5-20.3-26.2-27.5-37.5-35c-12.2-8-13.5-9.8-13.5-18c0-5.1,4.3-12.3,9.3-15.4c1.9-1.1,6.5-2.9,10.2-3.8c5.9-1.4,8-1.5,17.4-0.4 c25.5,3.1,42.4,8.5,56.9,18.2C436.8,364.5,455.8,383.9,465,396z"
          fill={getFingerColor(Finger.R_THUMB)}
          {...getFingerStroke(Finger.R_THUMB)}
          className="transition-all duration-150"
        />
      </g>

      {/* Index Finger */}
      <g transform={getTransform(Finger.R_INDEX)}>
        <path
          d="M508.5,138.5L455.4,164c-7.2-23-11.4-49.6-9.4-60.8c1.7-10.2,7.4-18.2,15.9-22.7c8.1-4.1,19-2.6,25.2,3.6 C494.5,91.5,503.4,114.1,508.5,138.5z"
          fill={getFingerColor(Finger.R_INDEX)}
          {...getFingerStroke(Finger.R_INDEX)}
          className="transition-all duration-150"
        />
      </g>

      {/* Middle Finger */}
      <g transform={getTransform(Finger.R_MIDDLE)}>
        <path
          d="M613.8,111.5l-56.4,6c-3.1-16.2-6.4-40.2-7.1-51.7c-0.7-11,1.3-18,7-24.4c3.9-4.4,7.3-6.8,13.2-9.1 c5.2-2,13.5-1.5,19,1.1c10.4,4.9,13.3,11.1,18.4,39.8C610.1,84.9,612.7,102.1,613.8,111.5z"
          fill={getFingerColor(Finger.R_MIDDLE)}
          {...getFingerStroke(Finger.R_MIDDLE)}
          className="transition-all duration-150"
        />
      </g>

      {/* Ring Finger */}
      <g transform={getTransform(Finger.R_RING)}>
        <path
          d="M736.3,150l-51.8-20.9c0.2-18.8,0.9-35.8,1.5-38.8c1.5-6.9,6-12.8,13-16.7c4.7-2.7,6.5-3.1,12.5-3.1 c6,0.1,7.9,0.5,12.5,3.1c6.3,3.5,11.4,9.6,13.2,15.7C738.9,95,738.4,135.8,736.3,150z"
          fill={getFingerColor(Finger.R_RING)}
          {...getFingerStroke(Finger.R_RING)}
          className="transition-all duration-150"
        />
      </g>

      {/* Pinky Finger Tip */}
      <g transform={getTransform(Finger.R_PINKY)}>
        <path
          d="M874.1,234.9c-5.4,13.5-6.8,16.1-15.2,28.8L819,234.5c8.9-18.6,17.7-32.2,25.6-39.4c6.4-5.8,10.7-7.5,18-6.9 c7.2,0.6,12.4,4.2,15.8,10.9C882.8,208,881.9,215.4,874.1,234.9z"
          fill={getFingerColor(Finger.R_PINKY)}
          {...getFingerStroke(Finger.R_PINKY)}
          className="transition-all duration-150"
        />
      </g>
    </svg>
  );
};

/**
 * Single Key component
 */
const Key = ({ keyData, isActive, isHinted, showFingerColors }) => {
  const { key, shift, width, finger, isHome, display } = keyData;
  const color = fingerColors[finger];

  const displayLabel = display !== undefined ? display : (key.length === 1 ? key.toUpperCase() : key);

  return (
    <div
      className={`
        relative flex flex-col items-center justify-center
        h-8 sm:h-9 rounded-md text-[9px] sm:text-[11px] font-medium
        transition-all duration-100 select-none
        border border-gray-300 dark:border-gray-600
        ${isActive
          ? 'transform -translate-y-1 shadow-lg z-10 ring-2 ring-blue-400'
          : isHinted
            ? 'transform -translate-y-0.5 shadow-md z-10 ring-2'
            : 'shadow-sm'
        }
        ${isHome && !isActive && !isHinted ? 'ring-1' : ''}
      `}
      style={{
        width: `${width * 2.2}rem`,
        minWidth: `${width * 1.6}rem`,
        backgroundColor: isActive
          ? '#3b82f6'
          : isHinted
            ? color.light
            : showFingerColors
              ? `${color.light}60`
              : 'var(--key-bg, #f3f4f6)',
        borderColor: isActive ? '#3b82f6' : isHinted ? color.base : undefined,
        ringColor: isActive ? '#60a5fa' : isHinted ? color.base : isHome ? color.base : undefined,
        color: isActive ? 'white' : 'inherit',
        '--key-bg': 'rgb(243 244 246)',
      }}
    >
      {shift && key.length === 1 && (
        <span className="text-[7px] sm:text-[8px] opacity-40 leading-none mb-0.5">{shift}</span>
      )}
      <span className="leading-none">{displayLabel}</span>
      {isHome && (
        <div className="absolute bottom-0.5 w-3 h-0.5 rounded-full opacity-60" style={{ backgroundColor: color.base }} />
      )}
    </div>
  );
};

/**
 * Main 2D Keyboard Visualization component
 * Hands positioned BELOW keyboard to match natural typing position
 */
const KeyboardVisualization2D = forwardRef(function KeyboardVisualization2D(
  { showHints = true, showFingerColors = true, showHands = true },
  ref
) {
  const [activeKey, setActiveKey] = useState(null);
  const [hintedKey, setHintedKey] = useState(null);
  const [hintedFinger, setHintedFinger] = useState(null);
  const [pressedFinger, setPressedFinger] = useState(null);

  const getKeyInfo = useCallback((char) => charToKeyInfo.get(char) || null, []);

  useImperativeHandle(ref, () => ({
    highlightNextKey: (char) => {
      if (!char) { setHintedKey(null); setHintedFinger(null); return; }
      const keyInfo = getKeyInfo(char);
      if (keyInfo) { setHintedKey(char); setHintedFinger(keyInfo.finger); }
      else { setHintedKey(null); setHintedFinger(null); }
    },
    pressKey: (char) => {
      const keyInfo = getKeyInfo(char);
      if (keyInfo) { setActiveKey(char); setPressedFinger(keyInfo.finger); }
    },
    releaseKey: () => { setActiveKey(null); setPressedFinger(null); },
    reset: () => { setActiveKey(null); setHintedKey(null); setHintedFinger(null); setPressedFinger(null); },
    getFingerForChar: (char) => { const keyInfo = getKeyInfo(char); return keyInfo ? keyInfo.finger : null; },
  }), [getKeyInfo]);

  const isKeyActive = useCallback((keyData) => {
    if (!activeKey) return false;
    const char = activeKey.toLowerCase();
    return keyData.key === char || keyData.key === activeKey || keyData.shift === activeKey;
  }, [activeKey]);

  const isKeyHinted = useCallback((keyData) => {
    if (!hintedKey || !showHints) return false;
    const char = hintedKey.toLowerCase();
    return keyData.key === char || keyData.key === hintedKey || keyData.shift === hintedKey;
  }, [hintedKey, showHints]);

  const fingerLegend = useMemo(() => [
    { finger: Finger.L_PINKY, label: 'Pinky' },
    { finger: Finger.L_RING, label: 'Ring' },
    { finger: Finger.L_MIDDLE, label: 'Middle' },
    { finger: Finger.L_INDEX, label: 'Index' },
    { finger: Finger.L_THUMB, label: 'Thumb' },
  ], []);

  const activeFinger = pressedFinger || hintedFinger;
  const activeColor = activeFinger ? fingerColors[activeFinger] : null;

  return (
    <div className="w-full space-y-3">
      {/* Current finger indicator - centered above keyboard */}
      {showHands && (
        <div className="flex justify-center">
          <div className="flex flex-col items-center min-w-[140px]">
            {activeFinger ? (
              <div
                className="px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-all duration-150"
                style={{
                  backgroundColor: pressedFinger ? activeColor.base : activeColor.light,
                  color: pressedFinger ? 'white' : activeColor.dark,
                  border: `2px solid ${activeColor.base}`,
                }}
              >
                {activeColor.name}
              </div>
            ) : (
              <div className="px-4 py-2 text-sm text-gray-400 dark:text-gray-500">
                Ready to type...
              </div>
            )}
            {hintedKey && (
              <div className="mt-2 text-center">
                <kbd
                  className="px-3 py-1.5 rounded-lg text-sm font-mono font-bold shadow-sm"
                  style={{
                    backgroundColor: activeColor?.light || '#f3f4f6',
                    color: activeColor?.dark || '#374151',
                    border: `2px solid ${activeColor?.base || '#d1d5db'}`,
                  }}
                >
                  {hintedKey === ' ' ? '␣ Space' : hintedKey.toUpperCase()}
                </kbd>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keyboard */}
      <div
        className="flex flex-col items-center gap-0.5 p-3 rounded-2xl"
        style={{ background: 'linear-gradient(145deg, #e2e8f0, #cbd5e1)' }}
      >
        <style>{`
          .dark [style*="--key-bg"] { --key-bg: rgb(55 65 81); }
          .dark [style*="linear-gradient(145deg, #e2e8f0"] { background: linear-gradient(145deg, #374151, #1f2937); }
        `}</style>

        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-0.5">
            {row.map((keyData, keyIndex) => (
              <Key
                key={keyData.id || `${rowIndex}-${keyIndex}`}
                keyData={keyData}
                isActive={isKeyActive(keyData)}
                isHinted={isKeyHinted(keyData)}
                showFingerColors={showFingerColors}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Hands - BELOW keyboard */}
      {showHands && (
        <div className="flex justify-center items-start gap-4 pt-2">
          <div className="w-32 h-24 sm:w-44 sm:h-32">
            <LeftHandSVG
              hintedFinger={showHints ? hintedFinger : null}
              pressedFinger={pressedFinger}
              showFingerZones={showFingerColors}
            />
          </div>

          <div className="w-32 h-24 sm:w-44 sm:h-32">
            <RightHandSVG
              hintedFinger={showHints ? hintedFinger : null}
              pressedFinger={pressedFinger}
              showFingerZones={showFingerColors}
            />
          </div>
        </div>
      )}

      {/* Finger color legend */}
      {showFingerColors && (
        <div className="flex justify-center gap-3 sm:gap-4 flex-wrap pt-1">
          {fingerLegend.map(({ finger, label }) => (
            <div key={finger} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: fingerColors[finger].base }} />
              <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default KeyboardVisualization2D;
