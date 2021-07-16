/**
 * @file Functions for sending Kmails and gifts to other players.
 */

import {
  isGiftable,
  isTradeable,
  itemAmount,
  myMeat,
  myStorageMeat,
  storageAmount,
  toInt,
  visitUrl,
} from 'kolmafia';

/** Error class used when sending a kmail to another player fails. */
export class KmailError extends Error {
  recipent: string;

  constructor(recipent: string, message?: string) {
    if (message === undefined) {
      message = `Failed to send gift to '${recipent}'`;
    }
    super(message);

    this.message = message;
    this.recipent = recipent;
  }
}
KmailError.prototype.name = 'KmailError';

/**
 * Error class used when a kmail cannot be sent to another player because the
 * recipent is under ascension restrictions and cannot receive meat or items.
 */
export class RecipentRestrictedError extends KmailError {
  constructor(recipent: string) {
    super(
      recipent,
      `The player '${recipent}' cannot receive meat or items due to ascension restrictions`
    );
  }
}
RecipentRestrictedError.prototype.name = 'RecipentRestrictedError';

export const MESSAGE_CHAR_LIMIT = 2000;
export const MAX_ITEMS_PER_KMAIL = 11;

/**
 * Sends one or more kmails to another player.
 * If necessary, this will send items using multiple kmails.
 *
 * This will always send at least one kmail.
 * @throws {KmailError} If the kmail cannot be sent for some reason.
 * @throws {RecipentRestrictedError} If the kmail cannot be sent because the
 *    recipent is under ascension restrictions and cannot receive meat or items.
 */
export function kmail({
  recipent,
  message = '',
  meat = 0,
  items = new Map(),
}: {
  recipent: string;
  message?: string;
  meat?: number;
  items?: ReadonlyMap<Item, number>;
}): void {
  if (!Number.isInteger(meat)) {
    throw new KmailError(`Meat amount must be integer (got ${meat})`);
  } else if (meat < 0) {
    throw new KmailError(`Invalid meat amount: ${meat}`);
  } else if (meat > myMeat()) {
    throw new KmailError(`You don't have ${meat} meat`);
  }

  for (const [item, amount] of items) {
    if (item === Item.get('none')) {
      throw new KmailError(recipent, `Invalid item: ${item}`);
    } else if (!isTradeable(item)) {
      throw new KmailError(recipent, `Item cannot be sent by Kmail: ${item}`);
    }

    if (!(Number.isInteger(amount) && amount > 0)) {
      throw new KmailError(
        recipent,
        `Invalid item amount: Cannot send ${amount} of ${item}`
      );
    } else if (itemAmount(item) < amount) {
      throw new KmailError(
        recipent,
        `Insufficient item in inventory: Cannot send ${amount} of ${item}`
      );
    }
  }

  if (message.length > MESSAGE_CHAR_LIMIT) {
    throw new KmailError(
      `Message is too long, must be truncated to ${MESSAGE_CHAR_LIMIT}`
    );
  }

  const itemsToSend = Array.from(items);
  let isFirstKmail = true;

  // Always send the first message
  for (
    let i = 0;
    i < itemsToSend.length || isFirstKmail;
    i += MAX_ITEMS_PER_KMAIL
  ) {
    const itemUrlStr = itemsToSend
      .slice(i, i + MAX_ITEMS_PER_KMAIL)
      .map(
        ([item, amount], index) =>
          `howmany${index + 1}=${amount}&whichitem${index + 1}=${toInt(item)}`
      )
      .join('&');
    const meatToSend = isFirstKmail ? meat : 0;

    const response = visitUrl(
      `sendmessage.php?pwd=&action=send&towho=${recipent}&message=${message}&sendmeat=${meatToSend}&${itemUrlStr}`
    );
    if (response.includes('That player cannot receive Meat or items')) {
      throw new RecipentRestrictedError(recipent);
    }
    if (!response.includes('Message sent.')) {
      throw new KmailError(
        `Failed to send message to ${recipent} for some reason`
      );
    }

    isFirstKmail = false;
  }
}

/** Error class used when sending a gift to another player fails. */
export class GiftError extends Error {
  recipent: string;

  constructor(recipent: string, message?: string) {
    if (message === undefined) {
      message = `Failed to send gift to '${recipent}'`;
    }
    super(recipent);

    this.message = message;
    this.recipent = recipent;
  }
}
GiftError.prototype.name = 'GiftError';

/**
 * Sends meat or items to another player using one or more gift boxes.
 * This will send multiple gift boxes to send all given items.
 * @throws {GiftError} If the gift(s) cannot be sent for some reason.
 */
export function sendGift({
  recipent,
  message = '',
  meat = 0,
  items = new Map(),
  insideNote = '',
  useStorage,
}: {
  /** Target player */
  recipent: string;
  /** Message to send with the gift box */
  message?: string;
  /** Meat to send to recipent */
  meat?: number;
  /** Items to send to recipent */
  items?: ReadonlyMap<Item, number>;
  /** Message to show when the recipent opens the gift box */
  insideNote?: string;
  /**
   * If `true`, will send meat and items from your storage instead of the
   * inventory.
   */
  useStorage?: boolean;
}): void {
  if (!Number.isInteger(meat)) {
    throw new GiftError(`Meat amount must be integer (got ${meat})`);
  } else if (meat < 0) {
    throw new GiftError(`Invalid meat amount: ${meat}`);
  }

  for (const [item, amount] of items) {
    if (item === Item.get('none')) {
      throw new GiftError(recipent, `Invalid item: ${item}`);
    } else if (!isGiftable(item)) {
      throw new GiftError(recipent, `Item is not giftable: ${item}`);
    }

    if (!(Number.isInteger(amount) && amount > 0)) {
      throw new GiftError(
        recipent,
        `Invalid item amount: Cannot send ${amount} of ${item}`
      );
    } else if ((useStorage ? storageAmount(item) : itemAmount(item)) < amount) {
      throw new GiftError(
        recipent,
        `Insufficient item in ${
          useStorage ? 'storage' : 'inventory'
        }: Cannot send ${amount} of ${item}`
      );
    }
  }

  if (meat === 0 && items.size === 0) {
    // KoL message: "Getting an empty package would be just about the most
    // disappointing thing ever."
    throw new GiftError(
      recipent,
      'Cannot send 0 meat and no items in a gift package'
    );
  }

  // Always use plain brown wrapper or less-than-three-shaped box, since they
  // are the cheapest options per item
  const packagingCost = items.size * 50;
  if ((useStorage ? myStorageMeat() : myMeat()) < meat + packagingCost) {
    throw new GiftError(
      recipent,
      `Insufficient meat in ${
        useStorage ? 'storage' : 'inventory'
      }: Cannot send ${meat} meat and ${items.size} item${
        items.size > 1 ? 's' : ''
      }`
    );
  }

  const itemsToSend = Array.from(items);
  let meatToSend = meat;
  const MAX_ITEMS_PER_PACKAGE = 2;

  const prefix = useStorage ? 'hagnks_' : '';
  for (
    let i = 0;
    i < itemsToSend.length || meatToSend > 0;
    i += MAX_ITEMS_PER_PACKAGE
  ) {
    const itemsForCurrentPackage = itemsToSend.slice(
      i,
      i + MAX_ITEMS_PER_PACKAGE
    );
    // 1 for plain brown wrapper, 2 for less-than-three-shaped box
    const packageType = itemsForCurrentPackage.length > 1 ? 2 : 1;
    const itemSource = useStorage ? 1 : 0;
    const itemUrlStr = itemsForCurrentPackage
      .map(
        ([item, amount], index) =>
          `${prefix}howmany${index + 1}=${amount}&${prefix}whichitem${
            index + 1
          }=${toInt(item)}`
      )
      .join('&');

    const response = visitUrl(
      `town_sendgift.php?pwd=&towho=${recipent}&note=${message}&insidenote=${insideNote}&whichpackage=${packageType}&fromwhere=${itemSource}&sendmeat=${meatToSend}&action=Yep.&${itemUrlStr}`
    );
    if (response.includes('gift box spamming problem')) {
      throw new GiftError(
        recipent,
        `Cannot send gift to ${recipent}: Daily gift box limit reached`
      );
    }
    if (!response.includes('Package sent.')) {
      throw new GiftError(
        recipent,
        `Failed to send a gift to ${recipent} for some reason`
      );
    }
    meatToSend = 0;
  }
}

/**
 * Sends kmails and/or gift messages to another player.
 *
 * This will always send meat and items from the inventory.
 * To send meat and items in the storage, use {@link sendGift `sendGift()`}
 * instead.
 * @throws {KmailError | GiftError}
 */
export function sendToPlayer({
  recipent,
  message,
  meat,
  items = new Map(),
  insideNote,
}: {
  /** Target player */
  recipent: string;
  /** Message to send in the kmails and/or gift boxes */
  message?: string;
  /** Meat to send to recipent */
  meat?: number;
  /** Items to send to recipent */
  items?: ReadonlyMap<Item, number>;
  /** Message to put inside the gift box(es) when sending gifts */
  insideNote?: string;
}): void {
  const messageItems = new Map<Item, number>();
  let giftItems = new Map<Item, number>();
  for (const [item, amount] of items) {
    if (isTradeable(item)) {
      messageItems.set(item, amount);
    } else if (isGiftable(item)) {
      giftItems.set(item, amount);
    } else {
      throw new GiftError(
        `${item} cannot be sent to another player because it is neither tradable nor giftable`
      );
    }
  }

  let hasSentMeat = false;
  try {
    kmail({recipent, message, meat, items: new Map(messageItems)});
    hasSentMeat = true;
  } catch (error) {
    if (error instanceof RecipentRestrictedError) {
      giftItems = items as Map<Item, number>;
    } else {
      throw error;
    }
  }

  // Send gift
  if (giftItems.size > 0 || !hasSentMeat) {
    sendGift({
      recipent,
      message,
      meat,
      items: giftItems,
      insideNote,
      useStorage: false,
    });
  }
}
