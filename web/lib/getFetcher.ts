/** TODO: unit test **/

/** A wrapper function for native fetch GET **/
async function fetcher<Type>(input: RequestInfo | URL, init?: RequestInit): Promise<Type> {
  return await fetch(input, init).then(async res => await res.json());
};

/** fetcher factory that allows users to pass custom init to the native fetch */
function getFetcher<Type>(init: RequestInit = {}): typeof fetcher<Type> {
  return async(...args) => {
    if ((args?.[1]) != null) {
      Object.assign(args[1], init);
    } else {
      args[1] = init;
    }
    return await fetcher<Type>(...args);
  };
};

export default getFetcher;
