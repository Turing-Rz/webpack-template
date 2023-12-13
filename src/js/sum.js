export default function sum(...args) {
   return args.reduce((a , p) => a + p , 0)
}