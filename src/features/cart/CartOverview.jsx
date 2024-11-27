function CartOverview() {
  return (
    <div className="bg-yellow-950 text-yellow-50 flex justify-between py-4 px-3 absolute w-[100%] bottom-0">
      <p className="space-x-8">
        <span>2 pizzas</span>
        <span>$23.45</span>
      </p>

      <a href="#">Open cart &rarr;</a>
    </div>
  );
}

export default CartOverview;
