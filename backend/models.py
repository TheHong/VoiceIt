"""
These must agree with models/notes.tsx in the frontend
"""

from re import T


class Note:
    def __init__(self, name, duration, tie=False):
        # Note: Don't nest additional objects here. If need to, edit NoteResult.to_dict
        self.name = name
        self.duration = duration
        self.tie=tie

    def to_dict(self):
        return {"name": self.name, "duration": self.duration, "tie": int(self.tie)}
        d = self.__dict__
        d["tie"] = int(self.tie)
        return d

class NoteResult:
    def __init__(self, data, info=""):
        """Result object sent via api

        Args:
            data (list[list[Note]]): List of vars, where each bar is a list of Note
            info (string, optional): String parameter that could be used
        """
        self.data = data
        self.info = info

    def to_dict(self):
        return {"data": [[note.to_dict() for note in bar] for bar in self.data], "info": self.info}

