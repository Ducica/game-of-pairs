import axios from "axios";

const getRequest = async (endpoint: string) => {
  const response: any = await axios.get(endpoint);
  if (response.statusText === "OK") {
    return response;
  }

  throw new Error(`Failed to fetch ${endpoint}`);
};

/**
 * Get a random image of a cat!
 *
 */
export const cat = async () => {
  return getRequest("https://aws.random.cat/meow").then((res) => res.data.file);
};

/**
 * Get a random image of a dog!
 *
 */
export const dog = async () => {
  return getRequest("https://dog.ceo/api/breeds/image/random").then(
    (res) => res.data.message
  );
};

/**
 * Get a random image of a bunny!
 *
 */
export const bunny = async () => {
  return getRequest("https://api.bunnies.io/v2/loop/random/?media=png").then(
    (res) => res.data.media.poster
  );
};

/**
 * Get a random image of a duck!
 *
 */
export const duck = async () => {
  return getRequest("https://random-d.uk/api/v1/random?type=png").then(
    (res) => res.data.url
  );
};

/**
 * Get a random image of a fox!
 *
 */
export const fox = async () => {
  return getRequest("https://randomfox.ca/floof/").then(
    (res) => res.data.image
  );
};

/**
 * Get a random image of a lizard!
 *
 */
export const lizard = async () => {
  return getRequest("https://nekos.life/api/v2/img/lizard").then(
    (res) => res.data.url
  );
};

/**
 * Get a random image of a shiba!
 *
 */
export const shiba = async () => {
  return getRequest("http://shibe.online/api/shibes").then(
    (res) => res.data[0]
  );
};

/**
 * Get a random image of a koala!
 *
 */
export const koala = async () => {
  return getRequest("https://some-random-api.ml/img/koala").then(
    (res) => res.data.link
  );
};

/**
 * Get a random image of a panda!
 *
 */
export const panda = async () => {
  return getRequest("https://some-random-api.ml/img/panda").then(
    (res) => res.data.link
  );
};

/**
 * Get a random image of a Birb!
 *
 */
export const bird = async () => {
  return getRequest("https://some-random-api.ml/img/bird").then(
    (res) => res.data.link
  );
};

export const any = () => {};
