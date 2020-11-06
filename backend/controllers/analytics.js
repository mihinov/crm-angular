const moment = require("moment");

const Order = require("../models/Order");
const errorHandler = require("../utils/errorHandler");

module.exports.overview = async function (req, res) {
  try {
    const allOrders = await Order.find({ user: req.user.id }).sort({ date: 1 });
    const ordersMap = getOrdersMap(allOrders);
    const yesterdayOrders =
      ordersMap[moment().add(-1, "d").format("DD.MM.YYYY")] || [];
    const yesterdayOrdersNumber = yesterdayOrders.length; // Кол-во заказов вчера

    const totalOrdersNumber = allOrders.length; // Кол-во заказов
    const daysNumber = Object.keys(ordersMap).length; // Кол-во дней всего
    const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0); // Заказов в день
    const ordersPercent = (
      (yesterdayOrdersNumber / ordersPerDay - 1) *
      100
    ).toFixed(2); // Процент для количества заказов
    const totalGain = calculatePrice(allOrders); // Общая выручка
    const gainPerDay = totalGain / daysNumber; // Выручка в день
    const yesterdayGain = calculatePrice(yesterdayOrders); // Выручка за вчера
    const gainPercent = ((yesterdayGain / gainPerDay - 1) * 100).toFixed(2); // Процент выручки
    const compareGain = (yesterdayGain - gainPerDay).toFixed(2); // Сравнение выручки
    const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2); // Сравнение кол-ва заказов

    res.status(200).json({
      gain: {
        percent: Math.abs(+gainPercent),
        compare: Math.abs(+compareGain),
        yesterday: +yesterdayGain,
        isHigher: +gainPercent > 0,
      },
      orders: {
        percent: Math.abs(+ordersPercent),
        compare: Math.abs(+compareNumber),
        yesterday: +yesterdayOrdersNumber,
        isHigher: +ordersPercent > 0,
      },
    });
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.analytics = async function (req, res) {
  try {
    const allOrders = await Order.find({user: req.user.id}).sort({date: 1});
    const ordersMap = getOrdersMap(allOrders);

    const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);
    const chart = Object.keys(ordersMap).map(label => {
      // label === 05.05.2020
      const gain = calculatePrice(ordersMap[label]);
      const order = ordersMap[label].length;

      return {label, gain, order};
    });

    res.status(200).json({average, chart});
  } catch(e) {
    errorHandler(res, e);
  }
};

function getOrdersMap(orders = []) {
  const daysOrders = {};
  orders.forEach((order) => {
    const date = moment(order.date).format("DD.MM.YYYY");

    if (date === moment().format("DD.MM.YYYY")) {
      return;
    }

    if (!daysOrders[date]) {
      daysOrders[date] = [];
    }
    daysOrders[date].push(order);
  });
  return daysOrders;
}

function calculatePrice(orders = []) {
  return orders.reduce((total, order) => {
    const orderPrice = order.list.reduce((orderTotal, item) => {
      return (orderTotal += item.cost * item.quantity);
    }, 0);
    return (total += orderPrice);
  }, 0);
}
