import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { getEmailFromCookie } from '../misc/helper';
import { OfferService } from '../offer/offer.service';
import { MsgType } from '../misc/constants';
import Message from 'src/database/entities/message.entity';
import Chat from 'src/database/entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    private readonly userService: UserService,
    private readonly offerService: OfferService,
  ) {}

  private async extractUser(cookie: string) {
    const email = getEmailFromCookie(cookie);
    const user = await this.userService.findByEmail(email);
    if (user === undefined || user === null)
      throw new HttpException(
        `user email: '${email}' could not be found`,
        HttpStatus.PRECONDITION_FAILED,
      );
    console.log(user.email);
    return user;
  }

  async createMessage(cookie: string, createMessageData: CreateMessageDto) {
    let isOffer = true;
    let isText = true;
    if (
      createMessageData.offerId === undefined ||
      createMessageData.offerId === null
    ) {
      isOffer = false;
    } else {
      const offer = this.offerService.getById(createMessageData.offerId);
      const offerFound = (await offer) != null || (await offer) != undefined;
      isOffer = true;
      if (!offerFound)
        throw new HttpException(
          'offer to offerId not found in DB',
          HttpStatus.PRECONDITION_FAILED,
        );
    }

    if (createMessageData.text === undefined || createMessageData.text === null)
      isText = false;

    if (!isText && !isOffer) {
      // not text & not offerId - Error!
      throw new HttpException(
        'offerId or text is required',
        HttpStatus.PRECONDITION_FAILED,
      );
    } else if (isText && isOffer) {
      // text & offer - Error!
      throw new HttpException(
        'offerId and text recieved, should only be one',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const user = await this.extractUser(cookie);
    const newMessage = await Message.of(
      user.id,
      createMessageData.recieverId,
      createMessageData.text,
      isOffer ? MsgType.offer : MsgType.text,
      createMessageData.offerId,
    );

    const chats = await this.getAnyChats(user.id, createMessageData.recieverId);
    if (chats === null || chats === undefined || chats.length == 0) {
      // no chats found, we'll create one
      const newChat = await Chat.of(user.id, createMessageData.recieverId);
      await newChat.save();
    }
    return await newMessage.save();
  }

  async getAnyChats(id1: number, id2: number): Promise<Chat[]> {
    const chats = await Chat.find({
      where: { userId: id1 || id2, recieverId: id1 || id2 },
    });

    return chats;
  }

  async getAnyUserChats(userId: number): Promise<Chat[]> {
    const chats1 = await Chat.find({
      where: { userId: userId },
    });
    const chats2 = await Chat.find({
      where: { recieverId: userId },
    });
    const chats = chats1.concat(chats2);

    return chats;
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  async getChatByCookie(cookie: string): Promise<any> {
    return await this.getChatByUserId((await this.extractUser(cookie)).id);
  }

  async getChatByUserId(userId: number): Promise<any> {
    const chats = this.getAnyUserChats(userId);
    const userArr = [];
    // im userArr sollten alle id's sein, außer die vom akutellen user
    (await chats).forEach(function (chat) {
      if (chat.userId != userId && !userArr.includes(chat.userId)) {
        userArr.push(chat.userId);
      } else if (chat.userId != userId && !userArr.includes(chat.recieverId)) {
        userArr.push(chat.recieverId);
      }
    });
    let counter = 0;
    const chatStructList: any = [];
    userArr.forEach(async function (uId) {
      const chatStruct: any = {};
      chatStruct.id = uId;
      const user = await this.userService.findOneBy(uId);
      chatStruct.name = user.name;
      const messages1 = await Message.find({
        where: { userId: uId, recieverId: userId },
      });
      const messages2 = await Message.find({
        where: { recieverId: uId, userId: userId },
      });
      const messages = messages1.concat(messages2);
      messages.sort((a, b) => a.id - b.id);
      const messagesStructList: any = [];
      messages.forEach(async function (message) {
        const messagesStruct: any = {};
        messagesStruct.id = message.id;
        messagesStruct.text = message.text;
        messagesStruct.sender = message.userId == userId;
        messagesStruct.type = message.type;
        messagesStruct.offerId = message.offerId;
        messagesStructList.push(messagesStruct);
      });
      chatStruct.messages = messagesStructList;
      counter++;
      chatStructList.push(chatStruct);
    });

    return chatStructList;
  }
}
