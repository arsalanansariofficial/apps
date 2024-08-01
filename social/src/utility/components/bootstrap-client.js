'use client';

import { useEffect } from 'react';

export default function useBootstrap() {
  useEffect(function () {
    import('/bootstrap/dist/js/bootstrap.bundle.min.js');
  });
}
