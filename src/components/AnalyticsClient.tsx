'use client';
import { useEffect } from 'react';
import { track } from '@vercel/analytics';
/** Only anonymous event names and non-identifying categories; never player names or raw URLs. */
export function TrackView({event}:{event:string}){useEffect(()=>{track(event);},[event]);return null;}
