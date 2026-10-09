export function foodVisual(food: string) {
  if (/rice|curry/i.test(food)) return { category: 'Rice', emoji: '🍛' };
  if (/bread|pastr|bakery|cake|bun/i.test(food)) return { category: 'Bread', emoji: '🥐' };
  if (/fruit|apple|banana|orange/i.test(food)) return { category: 'Fruits', emoji: '🍎' };
  if (/vegetable|carrot|potato|salad/i.test(food)) return { category: 'Vegetables', emoji: '🥕' };
  return { category: 'Food', emoji: '🍽️' };
}
