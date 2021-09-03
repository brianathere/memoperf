export const eratosthenesSieve = () => {
    let bi = -1; // constructor resets the enumeration to start...
    let lowi = 0; // other initialization done here...
    let bpa: number[] = [];
    let bps: () => number;
    let buf: number[] = [];

    const next = (): number => {
    if (bi < 1) {
        if (bi < 0) {
          bi++;
          return 2;
        } else { // bi must be zero:
          let nxt = 3 + 2 * lowi + 262144; //just beyond the current page
          buf = [];
          for (let i = 0; i < 2048; i++) buf.push(0); // faster initialization 16 KByte's:
          if (lowi <= 0) { // special culling for first page as no base primes yet:
            for (let i = 0, p = 3, sqr = 9; sqr < nxt; i++, p += 2, sqr = p * p)
              if ((buf[i >> 5] & (1 << (i & 31))) === 0)
                for (let j = (sqr - 3) >> 1; j < 131072; j += p)
                  buf[j >> 5] |= 1 << (j & 31);
          } else { // other than the first "zeroth" page:
            if (!bpa.length) { // if this is the first page after the zero one:
              bps = eratosthenesSieve(); // initialize separate base primes stream:
              bps(); // advance past the only even prime of 2
              bpa.push(bps()); // keep the next prime (3 in this case)
            }
            // get enough base primes for the page range...
            for (let p = bpa[bpa.length - 1], sqr = p * p; sqr < nxt;
              p = bps(), bpa.push(p), sqr = p * p);
            for (let i = 0; i < bpa.length; i++) { //for each base prime in the array
              const p = bpa[i];
              let s = (p * p - 3) >> 1; //compute the start index of the prime squared
              if (s >= lowi) // adjust start index based on page lower limit...
                s -= lowi;
              else { //for the case where this isn't the first prime squared instance
                const r = (lowi - s) % p;
                s = (r !== 0) ? p - r : 0;
              }
              //inner tight composite culling loop for given prime number across page
              for (let j = s; j < 131072; j += p) buf[j >> 5] |= 1 << (j & 31);
            }
          }
        }
      }
      //find next marker still with prime status
      while (bi < 131072 && buf[bi >> 5] & (1 << (bi & 31))) bi++;
      if (bi < 131072) // within buffer: output computed prime
        return 3 + ((lowi + bi++) * 2);
      else { // beyond buffer range: advance buffer
        bi = 0;
        lowi += 131072;
        return next(); // and recursively loop just once to make a new page buffer
      }
    };
    return next;
  };