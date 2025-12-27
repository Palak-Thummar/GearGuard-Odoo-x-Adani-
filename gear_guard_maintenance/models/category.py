# -*- coding: utf-8 -*-
from odoo import fields, models


class GgEquipmentCategory(models.Model):
    _name = 'gg.equipment.category'
    _description = 'Equipment Category'

    name = fields.Char(required=True)
