import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { NotificationResponse } from '../dto/notification.dto';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  channel: string;

  @Prop()
  subject?: string;

  @Prop()
  content?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
