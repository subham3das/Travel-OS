import { PermissionModel, IPermission } from '../models/permission.model.js';

export class PermissionRepository {
  public async findAll(): Promise<IPermission[]> {
    return PermissionModel.find().sort({ module: 1, action: 1 }).exec();
  }

  public async findByModule(module: string): Promise<IPermission[]> {
    return PermissionModel.find({ module }).exec();
  }

  public async findByKey(key: string): Promise<IPermission | null> {
    return PermissionModel.findOne({ key }).exec();
  }

  public async create(data: Partial<IPermission>): Promise<IPermission> {
    const permission = new PermissionModel(data);
    return permission.save();
  }

  public async createMany(permissions: Array<Partial<IPermission>>): Promise<void> {
    for (const p of permissions) {
      await PermissionModel.updateOne(
        { key: p.key },
        { $setOnInsert: p },
        { upsert: true }
      );
    }
  }

  public async count(): Promise<number> {
    return PermissionModel.countDocuments().exec();
  }
}

export const permissionRepository = new PermissionRepository();
