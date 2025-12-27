# -*- coding: utf-8 -*-
from odoo import fields, models


class GgRequestStage(models.Model):
    _name = 'gg.request.stage'
    _description = 'Maintenance Request Stage'
    _order = 'sequence, id'

    name = fields.Char(required=True)
    sequence = fields.Integer(default=10)
    fold = fields.Boolean(help='Folded in Kanban view')
    is_done = fields.Boolean(string='Is Done Stage')
    is_scrap = fields.Boolean(string='Scrap Stage')
